// src/utils/auth.ts
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const isTokenExpired = async (accessToken: string, refreshToken: string): Promise<boolean> => {
    if (!accessToken) return true;

    const decoded = jwtDecode(accessToken);
    const now = Date.now() / 1000; // 当前时间（秒）

    // @ts-ignore
    if (decoded.exp < now) {
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