const sheetID = '1nWqerqanqhGPxbBxnxqyCHWLQF2WetG3D-dzNkfB-Gg'
const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`
const query = encodeURIComponent('Select *')
const sheetName = 'users'
const url = `${baseURL}&query=${sheetName}&tg=${query}`

// URL của Google Apps Script Web App của bạn
const scriptURL = '1To8YJx4tTZaf0-CnxHZvYSJBA0kYiV2v0Edb3w3mxNeF4lQ-1C1RLVPo'

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Xử lý đăng nhập
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(url);
            const data = await response.text();
            const jsonData = JSON.parse(data.substring(47).slice(0, -2));
            const rows = jsonData.table.rows;
            
            const user = rows.find(row => {
                const userData = row.c;
                return userData[0].v === username && userData[1].v === password;
            });
            
            if (user) {
                alert('Đăng nhập thành công!');
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi đăng nhập!');
        }
    });

    // Xử lý đăng ký
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('password').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra tài khoản đã tồn tại
        try {
            const response = await fetch(url);
            const data = await response.text();
            const jsonData = JSON.parse(data.substring(47).slice(0, -2));
            const rows = jsonData.table.rows;
            
            const userExists = rows.some(row => row.c[0].v === username);
            
            if (userExists) {
                alert('Tên đăng nhập đã tồn tại!');
                return;
            }

            // Gửi dữ liệu đăng ký đến Google Apps Script
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response2 = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            if (response2.ok) {
                alert('Đăng ký thành công!');
                registerForm.reset();
            } else {
                throw new Error('Lỗi khi đăng ký');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi đăng ký!');
        }
    });
});
