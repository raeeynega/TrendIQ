# StockVisionAI

StockVisionAI is an AI-powered web application for stock market prediction and analysis. It provides a suite of tools to help users leverage artificial intelligence for making informed financial decisions.

## Features

- **Prediction Dashboard**: Get next-day stock price predictions for any ticker symbol. The dashboard features an interactive TradingView chart for in-depth technical analysis.
- **AI Model Training**: Simulate the training of various machine learning models (LSTM, ARIMA, Prophet) for stock prediction and view their performance metrics.
- **News Sentiment Analysis**: Analyze the sentiment of financial news articles to gauge market mood. You can paste in an article or fetch mock news for a given stock or forex pair.

## Getting Started

To get started, simply run the development server:

```bash
npm run dev
```

Then open [http://localhost:9002](http://localhost:9002) in your browser.

## Pushing to GitHub

You can push your code to a new or existing GitHub repository to save your work and collaborate with others.

### For a new repository

1.  Go to [github.com/new](https://github.com/new) to create a new repository. You can skip adding a `README`, `.gitignore`, or license file since this project already has them.

2.  In your local project terminal, run the following commands to initialize a Git repository and push your code. Replace `<YOUR_REPOSITORY_URL>` with the URL you got from GitHub (it looks like `https://github.com/user/repo.git`).

    ```bash
    # Initialize a local Git repository
    git init -b main

    # Add all files to be tracked
    git add .

    # Create your first commit
    git commit -m "Initial commit"

    # Add your GitHub repository as the remote origin
    git remote add origin <YOUR_REPOSITORY_URL>

    # Push your code to GitHub
    git push -u origin main
    ```

Now your code is on GitHub! To save future changes, just run `git add .`, `git commit -m "Your commit message"`, and `git push`.
