const sheetID = '1KLc5OKZqVnPHxjcrOc5lrpYeZ0xymRU8nOfLl9hK614'
const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`
const query = encodeURIComponent('Select *')
const sheetName = 'users'
const url = `${baseURL}&query=${sheetName}&tg=${query}`

// URL của Google Apps Script Web App của bạn
const scriptURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=11KThATMRW28DpgfmTu1bUPC3m1_9jGld_A-7GgYznkM1Gkb0D488aDh5uDgurAM45CS4Sjh_vNNkmNg1YkXGd64m_YR1a0om5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnA9kSnu6HxDtdiXGCAoYtDzlIiPxXifjnNLBta_NU9znB_Gkq5fev3svRndt8T8YEXvvzAdRwyIRRHZx7yBLGYkACCOo0DRCOg&lib=MDbi98GmaevfUJIRysdtUai51ztMsFRcz'

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Xử lý đăng nhập
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(scriptURL);
            const jsonData = await response.json();
            
            const user = jsonData.data.find(user => 
                user.username === username && user.password === password
            );
            
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
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            // Kiểm tra tài khoản đã tồn tại
            const response = await fetch(scriptURL);
            const jsonData = await response.json();
            
            const userExists = jsonData.data.some(user => user.username === username);
            
            if (userExists) {
                alert('Tên đăng nhập đã tồn tại!');
                return;
            }

            // Gửi dữ liệu đăng ký đến Google Apps Script
            const response2 = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            alert('Đăng ký thành công!');
            registerForm.reset();
            window.location.href = 'index.html'; // Chuyển về trang đăng nhập
            
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi đăng ký!');
        }
    });
});
