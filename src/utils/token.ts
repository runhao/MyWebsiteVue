// src/utils/auth.ts
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const isTokenExpired = async (accessToken: string, refreshToken: string): Promise<boolean> => {
    if (!accessToken) return true;

    const tokenDecoded = jwtDecode(accessToken);
    const now = Date.now() / 1000; // 当前时间（秒）

    const expireTime = (tokenDecoded as any)?.exp as number | false;
    if (expireTime < now) {
        try {
            const res = await axios.post("/api/refresh/", {
                refresh: refreshToken // 将 refreshToken 放入请求体
            }, {
                headers: {
                    'Content-Type': 'application/json' // 确保请求头正确
                }
            });
            localStorage.setItem('access', res.data.access);
            return false; // 刷新成功，返回 false
        } catch (error) {
            // 捕获错误，检查是否是 401 状态
            return error.response && error.response.status === 401; // 或者根据需要返回其他值
        }
    }
    return false; // 令牌未过期
};

export const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    alert('请重新登录。');
}

export const computeUserName = async (token: string) => {
    const tokenDecoded = jwtDecode(token);
    // 使用可选链操作符和类型断言确保代码的健壮性
    const user_id = (tokenDecoded as any)?.user_id as number | false;
    const res = await axios.post("/api/user/name", {
        user_id: user_id
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return res.data.data.username; // 刷新成功，返回 false
}