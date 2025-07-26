const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Body parser middleware to parse JSON data from frontend
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) for the front-end
app.use(express.static('public'));

// Ultra-simple HTML Email Template for Admin (Gmail Compatible)
function getAdminEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Form Submission</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
        <tr>
            <td align="center" style="padding:20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#4CAF50;color:#ffffff;padding:30px;text-align:center;">
                            <h1 style="margin:0;font-size:28px;font-weight:normal;">🎉 New Form Submission!</h1>
                            <p style="margin:10px 0 0 0;font-size:16px;">Someone is interested in your services</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding:30px;">
                            <h2 style="color:#333333;margin:0 0 20px 0;font-size:20px;">Client Details:</h2>
                            
                            <!-- Details Table -->
                            <table width="100%" cellpadding="10" cellspacing="0" style="border:1px solid #dddddd;border-collapse:collapse;margin:20px 0;">
                                <tr style="background-color:#f8f9fa;">
                                    <td style="border:1px solid #dddddd;font-weight:bold;width:30%;">👤 Name:</td>
                                    <td style="border:1px solid #dddddd;"><strong>${data.name}</strong></td>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #dddddd;font-weight:bold;">📧 Email:</td>
                                    <td style="border:1px solid #dddddd;"><a href="mailto:${data.email}" style="color:#007bff;text-decoration:none;">${data.email}</a></td>
                                </tr>
                                <tr style="background-color:#f8f9fa;">
                                    <td style="border:1px solid #dddddd;font-weight:bold;">📱 Phone:</td>
                                    <td style="border:1px solid #dddddd;"><a href="tel:${data.phone}" style="color:#007bff;text-decoration:none;">${data.phone}</a></td>
                                </tr>
                                <tr>
                                    <td style="border:1px solid #dddddd;font-weight:bold;">🚀 Service:</td>
                                    <td style="border:1px solid #dddddd;">
                                        <span style="background-color:#28a745;color:#ffffff;padding:5px 10px;border-radius:12px;font-size:14px;font-weight:bold;">${data.service}</span>
                                    </td>
                                </tr>
                                <tr style="background-color:#f8f9fa;">
                                    <td style="border:1px solid #dddddd;font-weight:bold;">💰 Budget:</td>
                                    <td style="border:1px solid #dddddd;">
                                        <span style="background-color:#17a2b8;color:#ffffff;padding:5px 10px;border-radius:12px;font-weight:bold;">$${data.budget}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message Box -->
                            <div style="background-color:#e3f2fd;border-left:4px solid #2196f3;padding:15px;margin:20px 0;border-radius:0 5px 5px 0;">
                                <h3 style="margin:0 0 10px 0;color:#1976d2;font-size:16px;">💬 Client Message:</h3>
                                <p style="margin:0;font-style:italic;line-height:1.6;color:#333333;">"${data.message}"</p>
                            </div>
                            
                            <!-- Reply Button -->
                            <div style="text-align:center;margin:30px 0;">
                                <a href="mailto:${data.email}" style="background-color:#28a745;color:#ffffff;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block;">Reply to Client</a>
                            </div>
                            
                            <p style="color:#666666;font-size:12px;text-align:right;margin:30px 0 0 0;">
                                Received on: ${new Date().toLocaleString()}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#343a40;color:#ffffff;text-align:center;padding:20px;">
                            <p style="margin:0;font-size:14px;">📊 Contact Form Submission System</p>
                            <p style="margin:5px 0 0 0;font-size:12px;opacity:0.8;">Respond promptly to convert this lead!</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Ultra-simple HTML Email Template for Customer (Gmail Compatible)
function getCustomerEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank You for Your Submission</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
        <tr>
            <td align="center" style="padding:20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#2196F3;color:#ffffff;padding:40px 30px;text-align:center;">
                            <h1 style="margin:0;font-size:32px;font-weight:normal;">✨ Thank You!</h1>
                            <p style="margin:15px 0 0 0;font-size:18px;">Your submission has been received successfully</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 30px;">
                            <h2 style="color:#333333;margin:0 0 20px 0;font-size:22px;">Hello ${data.name},</h2>
                            
                            <p style="font-size:16px;line-height:1.6;color:#555555;margin:0 0 25px 0;">
                                Thank you for reaching out to us! We're excited about the opportunity to work with you on your <strong>${data.service}</strong> project.
                            </p>
                            
                            <!-- Summary Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#667eea;color:#ffffff;border-radius:8px;overflow:hidden;margin:25px 0;">
                                <tr>
                                    <td style="padding:25px;text-align:center;">
                                        <h3 style="margin:0 0 15px 0;font-size:20px;">📋 Your Submission Summary</h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:15px;">
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:500;">Service Requested:</td>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);text-align:right;font-weight:bold;">${data.service}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:500;">Estimated Budget:</td>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);text-align:right;font-weight:bold;">$${data.budget}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:500;">Contact Email:</td>
                                                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.2);text-align:right;font-weight:bold;">${data.email}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0;font-weight:500;">Phone Number:</td>
                                                <td style="padding:8px 0;text-align:right;font-weight:bold;">${data.phone}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Message Preview -->
                            <div style="background-color:#f8f9fa;border-left:4px solid #28a745;padding:20px;margin:20px 0;border-radius:0 8px 8px 0;">
                                <h4 style="margin:0 0 10px 0;color:#28a745;font-size:16px;">💬 Your Message:</h4>
                                <p style="margin:0;font-style:italic;line-height:1.6;color:#333333;">"${data.message}"</p>
                            </div>
                            
                            <!-- Next Steps -->
                            <div style="background-color:#e8f5e8;padding:25px;border-radius:8px;margin:25px 0;">
                                <h3 style="color:#28a745;margin:0 0 20px 0;font-size:18px;">🚀 What Happens Next?</h3>
                                
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding:8px 0;">
                                            <span style="background-color:#28a745;color:#ffffff;width:25px;height:25px;border-radius:50%;display:inline-block;text-align:center;line-height:25px;font-weight:bold;margin-right:15px;font-size:12px;">1</span>
                                            Our team will review your requirements within <strong>2-4 hours</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0;">
                                            <span style="background-color:#28a745;color:#ffffff;width:25px;height:25px;border-radius:50%;display:inline-block;text-align:center;line-height:25px;font-weight:bold;margin-right:15px;font-size:12px;">2</span>
                                            We'll prepare a detailed proposal tailored to your needs
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0;">
                                            <span style="background-color:#28a745;color:#ffffff;width:25px;height:25px;border-radius:50%;display:inline-block;text-align:center;line-height:25px;font-weight:bold;margin-right:15px;font-size:12px;">3</span>
                                            You'll receive a call/email within <strong>24-48 hours</strong> to discuss your project
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="margin:30px 0;line-height:1.6;color:#555555;">If you have any urgent questions, feel free to reply to this email or call us directly.</p>
                            
                            <!-- Reference Info -->
                            <table width="100%" cellpadding="15" cellspacing="0" style="background-color:#f8f9fa;border-radius:5px;margin:30px 0 0 0;">
                                <tr>
                                    <td>
                                        <p style="color:#666666;font-size:14px;margin:0;line-height:1.5;">
                                            <strong>Reference ID:</strong> #${Date.now().toString().slice(-6)}<br>
                                            <strong>Submitted on:</strong> ${new Date().toLocaleString()}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#343a40;color:#ffffff;text-align:center;padding:30px;">
                            <h3 style="margin:0 0 20px 0;font-size:18px;">Contact Information</h3>
                            <div style="margin:20px 0;font-size:14px;line-height:1.6;">
                                📧 Email: support@yourcompany.com<br>
                                📱 Phone: +1 (555) 123-4567<br>
                                🌐 Website: www.yourcompany.com
                            </div>
                            
                            <div style="margin:20px 0;">
                                <a href="#" style="color:#4facfe;text-decoration:none;margin:0 10px;font-weight:bold;">LinkedIn</a> |
                                <a href="#" style="color:#4facfe;text-decoration:none;margin:0 10px;font-weight:bold;">Twitter</a> |
                                <a href="#" style="color:#4facfe;text-decoration:none;margin:0 10px;font-weight:bold;">Facebook</a>
                            </div>
                            
                            <p style="margin:20px 0 0 0;opacity:0.8;font-size:12px;">
                                This is an automated message. Please do not reply directly to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, phone, message, service, budget } = req.body;

    // Email sending setup with explicit HTML support
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: 'itsmeghostriderr@gmail.com',
            pass: 'axrt mnsu atdk iaod',
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const formData = { name, email, phone, message, service, budget };

    // Email to YOU with the form submission details
    const mailToYou = {
        from: '"Contact Form System" <itsmeghostriderr@gmail.com>',
        to: 'isthisw39@gmail.com',
        subject: `🎉 New Form Submission from ${name}`,
        html: getAdminEmailTemplate(formData),
        headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high'
        }
    };

    // Email to Customer
    const mailToCustomer = {
        from: '"Your Company Team" <itsmeghostriderr@gmail.com>',
        to: email,
        subject: `✨ Thank You ${name}! Your submission has been received`,
        html: getCustomerEmailTemplate(formData)
    };

    // Send admin email first, then customer email
    transporter.sendMail(mailToYou, (error, info) => {
        if (error) {
            console.log('Error sending admin email:', error);
            return res.json({ success: false, error: 'Failed to send admin notification' });
        }
        console.log('Admin email sent successfully:', info.response);
        
        // Send customer email
        transporter.sendMail(mailToCustomer, (customerError, customerInfo) => {
            if (customerError) {
                console.log('Error sending customer email:', customerError);
                return res.json({ success: false, error: 'Failed to send customer confirmation' });
            }
            console.log('Customer email sent successfully:', customerInfo.response);
            res.json({ success: true });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});