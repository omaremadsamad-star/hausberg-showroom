<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied - Hausberg</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            background-color: #06070a;
            color: #ffffff;
            font-family: 'Montserrat', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
            position: relative;
        }
        /* Background Glows */
        body::before {
            content: '';
            position: absolute;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 70%);
            top: 20%;
            left: 15%;
            z-index: 1;
        }
        body::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(0,0,0,0) 70%);
            bottom: 10%;
            right: 10%;
            z-index: 1;
        }
        .container {
            text-align: center;
            z-index: 10;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
        }
        .error-code {
            font-size: 8rem;
            font-weight: 900;
            color: #d4af37;
            line-height: 1;
            margin-bottom: 1rem;
            letter-spacing: -2px;
            background: linear-gradient(135deg, #f3e5ab 0%, #d4af37 50%, #aa7c11 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 4px 20px rgba(212, 175, 55, 0.15));
            animation: pulse 3s infinite ease-in-out;
        }
        .logo-text {
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 2rem;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
            color: #ffffff;
        }
        p {
            font-size: 0.9rem;
            color: #8a8d9a;
            line-height: 1.6;
            margin-bottom: 2.5rem;
            font-weight: 300;
        }
        .btn {
            display: inline-block;
            text-decoration: none;
            background: linear-gradient(135deg, #f3e5ab 0%, #d4af37 100%);
            color: #06070a;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
            opacity: 0.95;
        }
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.03);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-text">Hausberg</div>
        <div class="error-code">403</div>
        <h1>Access Forbidden</h1>
        <p>You do not have the required administrative permissions to access this showroom configuration sector.</p>
        <a href="/" class="btn">Back to Showroom</a>
    </div>
</body>
</html>
