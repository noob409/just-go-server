import { getGoogleUserInfo, loginUser, registerUser } from "../../service/authService.js";

// // 使用表單登入的邏輯
// export const formLogin = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const userInfo = await loginUser(email, password);


//         console.log(userInfo)
//         res.status(200).json(userInfo);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// // 使用Google登入的邏輯
// export const customLogin = async (req, res) => {
//     const { code, isGoogle } = req.body;

//     try {
//         const userInfo = await getGoogleUserInfo(code, isGoogle);

//         // Check if userInfo is not null before accessing its properties
//         // and add username and email and password(opt) into users table
//         if (userInfo) {
//             console.log(userInfo);
//             res.status(200).json(userInfo);
//         } else {
//             res.status(500).json({ error: 'Failed to fetch user information' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// }

// 登入邏輯
export const login = async (req, res) => {
    if (req.body.isGoogle) {
        // 此區塊為googleLogin
        const { code, isGoogle } = req.body;

        try {
            const userInfo = await getGoogleUserInfo(code, isGoogle);

            // Check if userInfo is not null before accessing its properties
            // and add username and email and password(opt) into users table
            if (userInfo) {
                console.log(userInfo)
                res.status(200).json(userInfo);
            } else {
                res.status(500).json({ error: 'Failed to fetch user information' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    } else {
        // 此區塊為formLogin
        const { email, password } = req.body;

        try {
            const userInfo = await loginUser(email, password);
            console.log(userInfo)
            res.status(200).json(userInfo);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message });
        }
    };
}

// 註冊邏輯
export const register = async (req, res) => {
    const { name, email, password, isGoogle } = req.body;

    console.log("Form register received registration request for:", name, email, ",isGoogle:", isGoogle);

    try {
        const userInfo = await registerUser(name, email, password, isGoogle);

        if (userInfo) {
            res.status(200).json(userInfo);
        } else {
            res.status(500).json({ error: 'Failed to fetch user information' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: error.message });
    }
}