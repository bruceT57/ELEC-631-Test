# AI Provider Setup Guide

Complete guide to setting up ChatGPT (OpenAI), Google Gemini, and Claude AI for the Peer Study Planning Tool.

## Overview

This tool supports three AI providers. You only need **ONE** to get started, but you can configure all three and switch between them.

**Recommendation**: Start with OpenAI (ChatGPT) for best results.

## OpenAI (ChatGPT) Setup

### What is it?
OpenAI's GPT-4 is the most advanced language model, excellent for generating structured educational content.

### Cost
- **Pay-as-you-go**: ~$0.01-0.03 per planning sheet generation
- **Requires credit card on file**
- New accounts get $5 free credits

### Setup Steps

1. **Create OpenAI Account**
   - Go to https://platform.openai.com/
   - Click "Sign Up"
   - Verify email

2. **Add Payment Method**
   - Go to https://platform.openai.com/account/billing
   - Click "Add payment method"
   - Enter credit card details
   - Set usage limits if desired

3. **Generate API Key**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "Peer Study Planner"
   - **IMPORTANT**: Copy the key immediately (shown only once)
   - Key format: `sk-proj-...` or `sk-...`

4. **Add to .env**
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   DEFAULT_AI_PROVIDER=openai
   ```

5. **Test Connection**
   ```bash
   curl -X POST http://localhost:5000/api/planning/generate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "courseId": "YOUR_COURSE_ID",
       "weekNumber": 1,
       "aiProvider": "openai"
     }'
   ```

### Pricing Details
- GPT-4 Turbo: $0.01/1K input tokens, $0.03/1K output tokens
- Typical planning sheet: ~$0.02-0.05
- Monitor usage: https://platform.openai.com/usage

### Troubleshooting

**"Insufficient quota"**
- Add payment method or add more credits
- Check billing page: https://platform.openai.com/account/billing

**"Invalid API key"**
- Key format must be `sk-...`
- Regenerate if lost
- Check for spaces or newlines in .env

**"Rate limit exceeded"**
- Free tier: 3 requests/minute
- Paid tier: 10,000 requests/minute
- Wait a moment and retry

---

## Google Gemini Setup

### What is it?
Google's Gemini Pro model, fast and cost-effective for educational content generation.

### Cost
- **FREE tier**: 60 requests/minute
- **No credit card required**
- Perfect for testing or light usage

### Setup Steps

1. **Get Google Account**
   - Use existing Gmail account
   - Or create new: https://accounts.google.com/signup

2. **Access Google AI Studio**
   - Go to https://makersuite.google.com/
   - Sign in with Google account
   - Accept terms of service

3. **Generate API Key**
   - Click "Get API Key" button
   - Click "Create API key in new project"
   - Or select existing project
   - **Copy the API key**
   - Key format: `AIza...`

4. **Add to .env**
   ```env
   GEMINI_API_KEY=AIzaSyYour-actual-key-here
   DEFAULT_AI_PROVIDER=gemini
   ```

5. **Test Connection**
   ```bash
   curl -X POST http://localhost:5000/api/planning/generate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "courseId": "YOUR_COURSE_ID",
       "weekNumber": 1,
       "aiProvider": "gemini"
     }'
   ```

### Pricing Details
- **Free Tier**: 60 requests/minute, 1500/day
- **Paid Tier**: Pay-as-you-go when needed
- Much cheaper than GPT-4 for high volume

### Troubleshooting

**"API key invalid"**
- Verify key from https://makersuite.google.com/app/apikey
- Key should start with `AIza`
- Regenerate if needed

**"Resource exhausted"**
- Free tier limit reached (60/min or 1500/day)
- Wait or upgrade to paid tier

**"API not enabled"**
- Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Click "Enable"

---

## Anthropic Claude Setup

### What is it?
Anthropic's Claude AI, excellent for long-form content and detailed analysis.

### Cost
- **Pay-as-you-go**: ~$0.01-0.02 per planning sheet
- **Requires credit card**
- Similar pricing to OpenAI

### Setup Steps

1. **Create Anthropic Account**
   - Go to https://console.anthropic.com/
   - Click "Sign Up"
   - Verify email

2. **Add Payment Method**
   - Go to https://console.anthropic.com/settings/billing
   - Add credit card
   - Minimum $5 credit purchase

3. **Generate API Key**
   - Go to https://console.anthropic.com/settings/keys
   - Click "Create Key"
   - Name it: "Peer Study Planner"
   - **Copy the key immediately**
   - Key format: `sk-ant-api03-...`

4. **Add to .env**
   ```env
   CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
   DEFAULT_AI_PROVIDER=claude
   ```

5. **Test Connection**
   ```bash
   curl -X POST http://localhost:5000/api/planning/generate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "courseId": "YOUR_COURSE_ID",
       "weekNumber": 1,
       "aiProvider": "claude"
     }'
   ```

### Pricing Details
- Claude 3 Sonnet: $0.003/1K input tokens, $0.015/1K output tokens
- Typical planning sheet: ~$0.01-0.03
- Monitor: https://console.anthropic.com/settings/usage

### Troubleshooting

**"Authentication error"**
- Key must start with `sk-ant-`
- Regenerate from console if lost
- Check for trailing spaces

**"Overloaded"**
- Claude servers busy
- Retry in a few seconds
- Consider OpenAI as fallback

**"Insufficient credits"**
- Add more credits in billing section
- Minimum $5 top-up

---

## Comparison & Recommendations

### For Getting Started
**Use: Gemini (Free)**
- No credit card needed
- 60 requests/minute free
- Good quality output
- Perfect for testing

### For Best Quality
**Use: OpenAI (GPT-4)**
- Most reliable structured output
- Best understanding of context
- JSON mode built-in
- Industry standard

### For Long Documents
**Use: Claude**
- 200K context window
- Excellent with lengthy materials
- Great for detailed analysis
- Good alternative to GPT-4

### For High Volume
**Use: Gemini (Paid)**
- Cheapest at scale
- Very fast responses
- Good enough quality
- Free tier for testing

## Multi-Provider Strategy

### Recommended Setup

```env
# Configure all three
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
CLAUDE_API_KEY=sk-ant-...

# Set default (your most-used)
DEFAULT_AI_PROVIDER=openai
```

### When to Use Each

**OpenAI (Default)**
- Initial generation
- Structured content needs
- When quality is priority

**Gemini (Fallback)**
- High-volume weeks
- Quick iterations
- Cost-conscious usage

**Claude (Special Cases)**
- Very long course materials
- Detailed analysis needs
- When OpenAI is down

### Switching Providers

**In API Request:**
```json
{
  "weekNumber": 1,
  "aiProvider": "gemini"  // override default
}
```

**In Settings:**
```json
{
  "preferredAiProvider": "claude"  // per-course default
}
```

## Cost Comparison

### Example: 15-week course, 2 sessions/week

| Provider | Per Planning | Total Cost |
|----------|--------------|------------|
| **Gemini Free** | $0.00 | $0.00 |
| **Gemini Paid** | $0.005 | $0.15 |
| **Claude** | $0.015 | $0.45 |
| **OpenAI** | $0.025 | $0.75 |

**Recommendation**: Use Gemini free for testing, OpenAI for production.

## Security Best Practices

### Protect Your API Keys
```bash
# ✓ Good - In .env file
OPENAI_API_KEY=sk-proj-...

# ✗ Bad - In code
const key = "sk-proj-..."

# ✗ Bad - In git
git add .env  # Never do this!
```

### .gitignore
```
.env
.env.local
*.key
```

### Key Rotation
- Rotate keys every 3-6 months
- Revoke old keys after rotation
- Never share keys publicly

### Rate Limiting
The tool automatically handles rate limits, but you can set usage limits:

**OpenAI:**
- https://platform.openai.com/account/limits
- Set monthly budget caps

**Gemini:**
- Free tier auto-limits
- Paid tier: Set in Cloud Console

**Claude:**
- No built-in limits
- Monitor usage regularly

## Testing All Providers

```bash
# Save your token
TOKEN="your-jwt-token"
COURSE_ID="your-course-id"

# Test OpenAI
curl -X POST http://localhost:5000/api/planning/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"'$COURSE_ID'","weekNumber":1,"aiProvider":"openai"}'

# Test Gemini
curl -X POST http://localhost:5000/api/planning/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"'$COURSE_ID'","weekNumber":2,"aiProvider":"gemini"}'

# Test Claude
curl -X POST http://localhost:5000/api/planning/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"'$COURSE_ID'","weekNumber":3,"aiProvider":"claude"}'
```

## FAQ

**Q: Do I need all three?**
A: No! Just one is enough. Gemini is free to start.

**Q: Which is best for education?**
A: OpenAI GPT-4 gives most consistent, structured results.

**Q: Can I switch providers for same course?**
A: Yes! Each planning can use a different provider.

**Q: What if my API key stops working?**
A: Regenerate from the provider's console, update .env, restart server.

**Q: How much will this cost me?**
A: With Gemini free tier: $0. With OpenAI: ~$0.50-2.00/semester.

**Q: Can I use my organization's API key?**
A: Yes, if you have permission. Check with your IT department.

**Q: Is my data private?**
A: OpenAI/Gemini/Claude process data on their servers. Don't include highly sensitive information.

---

**Ready to generate your first planning sheet! Choose your provider and get started! 🚀**
