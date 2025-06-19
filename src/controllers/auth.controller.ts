import prisma from "../libs/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {convertName} from "../helpers/common";

const JWT_SECRET: string = process.env.JWT_SECRET!;

export const login = async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({success: false, error: 'Thiếu email hoặc password'});
    }
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
        return res.status(401).json({success: false, error: 'Email không tồn tại'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({success: false, error: 'Tài khoản đăng nhập không chính xác'});
    }

    const token = jwt.sign(
        {id: user.id, email: user.email},
        JWT_SECRET,
        {expiresIn: '1d'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true nếu dùng HTTPS
        sameSite: 'lax', // hoặc 'none' nếu dùng HTTPS + cross-site
        maxAge: 60 * 60 * 1000, // 1h
    });

    return res.json({success: true})
}

export const register = async (req: any, res: any) => {
    try {
        const data = req.body;
        if (data.password.length < 8) {
            return res.status(400).json({success: false, error: 'Mật khẩu phải nhiều hơn 8 kí tự'});
        }
        const isExitUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (isExitUser) {
            return res.status(400).json({success: false, error: 'Email đã tồn tại'});
        }
        data.password = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                username: convertName(data.name),
                email: data.email,
                name: data.name,
                password: data.password
            }
        });
        return res.json({success: true, user: user})
    } catch (e) {
        return res.json({success: false, error: (e as Error).message})
    }
}

export const logout = async (req: any, res: any) => {
    res.clearCookie('token');
    res.json({ success: true });
}

export const me = async (req: any, res: any) => {
    return res.json({ success: true,  user: req.user });
}

export const updateProfile = async (req: any, res: any) => {
    const data = req.formData();
    console.log(data);
}