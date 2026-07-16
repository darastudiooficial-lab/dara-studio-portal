import weasyprint
import os

html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Estimate Wizard - Step 1</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');

        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: #f7f4eb;
            font-family: 'Inter', sans-serif;
            color: #333333;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }

        .container {
            padding: 60px 80px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
        }

        .header {
            margin-bottom: 40px;
        }

        .header h1 {
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 42px;
            color: #a38a5f;
            margin: 0 0 10px 0;
            font-weight: 600;
        }

        .header p {
            font-size: 14px;
            color: #928368;
            margin: 0;
            max-width: 600px;
            line-height: 1.5;
        }

        .content {
            display: flex;
            gap: 60px;
            flex-grow: 1;
        }

        .form-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .input-group label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #928368;
        }

        .input-group input {
            padding: 15px 20px;
            border: 1px solid rgba(163, 138, 95, 0.3);
            border-radius: 8px;
            background-color: transparent;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: #333;
            outline: none;
        }
        
        .input-group input::placeholder {
            color: #ccc;
        }

        .selection-section {
            flex: 1.5;
            display: flex;
            flex-direction: column;
        }

        .selection-section h2 {
            font-size: 18px;
            font-weight: 500;
            margin: 0 0 20px 0;
            color: #333;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .card {
            border: 1px solid rgba(163, 138, 95, 0.2);
            border-radius: 12px;
            padding: 20px;
            background-color: white;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 10px;
            transition: all 0.3s ease;
        }

        .card.selected {
            border: 2px solid #333;
            background-color: #f0ece1;
        }

        .card .icon {
            font-size: 24px;
        }

        .card .label {
            font-size: 14px;
            font-weight: 500;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 30px;
            border-top: 1px solid rgba(163, 138, 95, 0.2);
            margin-top: 20px;
        }

        .pagination {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(163, 138, 95, 0.3);
        }

        .dot.active {
            background-color: #a38a5f;
            width: 10px;
            height: 10px;
        }

        .step-text {
            font-size: 12px;
            color: #928368;
            margin-left: 10px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .actions {
            display: flex;
            gap: 15px;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            text-decoration: none;
            display: inline-block;
        }

        .btn-back {
            background-color: transparent;
            border: 1px solid rgba(163, 138, 95, 0.5);
            color: #928368;
        }

        .btn-next {
            background-color: #333;
            border: 1px solid #333;
            color: white;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Tell us about you.</h1>
            <p>Rest assured, your privacy is guaranteed. We'll use this information exclusively to personalize your estimate.</p>
        </div>

        <div class="content">
            <div class="form-section">
                <div class="input-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="John Doe">
                </div>
                <div class="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="john@example.com">
                </div>
                <div class="input-group">
                    <label>Phone</label>
                    <input type="text" placeholder="+1 (555) 000-0000">
                </div>
            </div>

            <div class="selection-section">
                <h2>What is your profile?</h2>
                <div class="cards-grid">
                    <div class="card selected">
                        <div class="icon">🏠</div>
                        <div class="label">Homeowner</div>
                    </div>
                    <div class="card">
                        <div class="icon">🔨</div>
                        <div class="label">Builder</div>
                    </div>
                    <div class="card">
                        <div class="icon">📐</div>
                        <div class="label">Architect</div>
                    </div>
                    <div class="card">
                        <div class="icon">📈</div>
                        <div class="label">Investor</div>
                    </div>
                    <div class="card">
                        <div class="icon">🤝</div>
                        <div class="label">Realtor</div>
                    </div>
                    <div class="card">
                        <div class="icon">✨</div>
                        <div class="label">Other</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="pagination">
                <div class="dot active"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <span class="step-text">Step 1 of 8</span>
            </div>
            <div class="actions">
                <a href="#" class="btn btn-back">← Back</a>
                <a href="#" class="btn btn-next">Continue →</a>
            </div>
        </div>
    </div>
</body>
</html>
"""

pdf_filename = "EstimateWizard_Design.pdf"
print(f"Generating {pdf_filename}...")
weasyprint.HTML(string=html_content).write_pdf(pdf_filename)
print("Done!")
