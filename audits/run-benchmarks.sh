#!/bin/bash
# MangaVerse Competitive Audit - Performance Benchmarking Script
# Date: October 18, 2025
# Usage: bash audits/run-benchmarks.sh

echo "======================================"
echo "MangaVerse Performance Benchmarking"
echo "======================================"
echo ""

# Check if server is running
echo "[1/5] Checking if server is running..."
if curl -s http://localhost:5000/ > /dev/null; then
  echo "✅ Server is running"
else
  echo "❌ Server is not running. Please start the server with 'npm run dev'"
  exit 1
fi

# Create output directory
mkdir -p audits/raw-data
echo ""

# Test 1: TTFB Measurement
echo "[2/5] Measuring Time to First Byte (TTFB)..."
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal Time: %{time_total}s\nHTTP Code: %{http_code}\n" http://localhost:5000/ | tee audits/raw-data/ttfb-test.txt
echo ""

# Test 2: Security Headers Audit
echo "[3/5] Auditing Security Headers..."
curl -I http://localhost:5000/ 2>&1 | grep -E "(Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Referrer-Policy)" | tee audits/raw-data/security-headers.txt
echo ""

# Test 3: Sitemap Check
echo "[4/5] Checking Sitemap..."
curl -s http://localhost:5000/sitemap.xml | head -50 | tee audits/raw-data/sitemap-sample.xml
echo "... (truncated, see audits/raw-data/sitemap-sample.xml for full output)"
echo ""

# Test 4: Bundle Size Analysis
echo "[5/5] Analyzing Bundle Size..."
if [ -f "dist/index.js" ]; then
  ls -lah dist/ | tee audits/raw-data/bundle-size.txt
  echo ""
  echo "Bundle size: $(du -h dist/index.js | cut -f1)"
else
  echo "⚠️  No dist/ folder found. Run 'npm run build' first."
fi
echo ""

echo "======================================"
echo "Benchmarking Complete!"
echo "======================================"
echo ""
echo "Results saved to:"
echo "  - audits/raw-data/ttfb-test.txt"
echo "  - audits/raw-data/security-headers.txt"
echo "  - audits/raw-data/sitemap-sample.xml"
echo "  - audits/raw-data/bundle-size.txt"
echo ""
echo "View full audit report: audit.md"
echo ""

# Optional: Run Lighthouse if Chrome is available
if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null; then
  echo "[OPTIONAL] Running Lighthouse audit..."
  npx lighthouse http://localhost:5000 \
    --output json \
    --output-path ./audits/raw-data/lighthouse-report.json \
    --only-categories=performance,seo,accessibility,best-practices \
    --chrome-flags="--headless --no-sandbox" 2>&1 | tail -20
else
  echo "⚠️  Chrome not available. Skipping Lighthouse audit."
  echo "   To run Lighthouse manually, use:"
  echo "   npx lighthouse http://localhost:5000 --view"
fi
