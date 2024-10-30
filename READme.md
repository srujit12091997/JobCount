# Job Application Counter

A web application to track job applications and visualize application statistics, created by Srujit Varasala.

## ⚠️ Important Note for Users

Before using this code:
1. The application is designed to work with a text file instead of CSV
2. Original CSV format had formatting issues
3. Use the provided text file format for reliable tracking
4. Avoid using Excel-exported CSV files directly

## Text File Format Guide

### ✅ Correct Format:
```text
date,company,position
10/29/2024,nvidia,Formal verification engineer
```

### ❌ Avoid:
```text
"date","company","position"
"10/29/2024","nvidia","formal verification engineer"
```

## Setup Instructions

### Prerequisites
- Visual Studio Code
- Web browser (Chrome recommended)

### Installing Live Server in VS Code

1. Open VS Code
2. Click on Extensions icon (or press Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Live Server"
4. Look for "Live Server" by Ritwick Dey (verify author)
5. Click Install
6. Wait for installation to complete
7. Reload VS Code if prompted

### Verifying Live Server Installation
1. Look for "Go Live" at the bottom-right of VS Code
2. If you don't see it:
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Live Server"
   - You should see Live Server commands listed

### Installation

1. Create a project folder:
```bash
mkdir job-counter
cd job-counter
```

2. Create these files:
```
job-counter/
├── index.html
├── style.css
├── script.js
└── applications.txt    # Use .txt instead of .csv
```

### Data File Setup

Create `applications.txt` with this format:
```text
date,company,position
10/29/2024,nvidia,Formal verification engineer
```

Important Rules:
- Keep header line exactly as shown
- Use MM/DD/YYYY date format
- No quotes around values
- No spaces after commas
- One entry per line
- Save as plain text file

### Running the Application

1. Open VS Code:
```bash
code .
```

2. Starting Live Server:
   - Right-click index.html
   - Select "Open with Live Server"
   - OR click "Go Live" in the bottom bar
   - Browser will open automatically

3. Default ports:
   - Usually opens on http://127.0.0.1:5500
   - If port 5500 is busy, might use 5501, 5502, etc.

## Troubleshooting Common Issues

### 1. File Format Issues:
```text
# Wrong ❌
"10/29/2024","nvidia","formal verification engineer"

# Correct ✅
10/29/2024,nvidia,Formal verification engineer
```

### 2. Live Server Not Working:
- Check bottom-right of VS Code for "Go Live"
- Try different port in VS Code settings
- Clear browser cache
- Restart VS Code

### 3. Data Not Loading:
- Verify file named exactly "applications.txt"
- Check file is in same folder as HTML
- Ensure no BOM characters in text file
- Use plain text editor (like VS Code) to edit file

## Author

Created by: Srujit Varasala
- Email: srujit.v@gmail.com
- LinkedIn: https://www.linkedin.com/in/srujitvarasala/

## Version

Current Version: 1.0.0
- Initial release: October 29, 2024
- Using text file instead of CSV
- Fixed counting system

## Updates

Latest updates:
- Switched from CSV to text file format
- Improved data validation
- Fixed duplicate entry issues
- Better error handling

## Support and Contact

For questions, issues, or suggestions:
- Email: srujit.v@gmail.com
- LinkedIn: https://www.linkedin.com/in/srujitvarasala/
- Project issues: Create an issue in the repository

Common Support Topics:
- File format questions
- Live Server setup
- Data validation issues
- Adding new entries

## License

MIT License © 2024 Srujit Varasala