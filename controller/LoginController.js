export async function Login(phone, password) {
    try {
        const result = await fetch(
            "http://localhost:9999", {
                "command": "LOGIN", 
                "details": {
                    "customer_phone": phone,
                    "password": password,
                },
            })
        const response = await result.wait()
        const statusCode = response.status
        const body = response.json()
        if (statusCode === 200 ){
            // parse body here
        } else {
            // return errors here
        }
    } catch (err) {
        console.log(err)
    }

}