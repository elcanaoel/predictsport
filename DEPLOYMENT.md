# 🚀 Deployment Guide - PredictSport

Your code is now on GitHub! Here's how to deploy it to production.

## ✅ GitHub Repository

**Repository:** https://github.com/elcanaoel/predictsport.git
**Status:** ✅ Pushed successfully
**Files:** 50 files, 11,999+ lines of code

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Best for:** Quick deployment with automatic cron jobs

#### Steps:

1. **Go to Vercel**
   - Visit https://vercel.com/
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New Project"
   - Select `elcanaoel/predictsport`
   - Click "Import"

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=file:./dev.db
   FOOTBALL_API_KEY=your-api-key-here
   FOOTBALL_API_HOST=v3.football.api-sports.io
   CRON_SECRET=your-random-secret-key
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! ✅

5. **Automatic Cron**
   - Vercel will automatically run daily updates at 6 AM
   - Configured via `vercel.json`
   - No additional setup needed!

**Your site will be live at:** `https://predictsport-xxx.vercel.app`

---

### Option 2: Netlify

**Best for:** Alternative to Vercel

#### Steps:

1. **Go to Netlify**
   - Visit https://www.netlify.com/
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add new site"
   - Select `elcanaoel/predictsport`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   Same as Vercel (see above)

5. **Deploy**
   - Click "Deploy site"

6. **Setup Cron (External)**
   - Use https://cron-job.org/
   - Add job:
     - URL: `https://your-site.netlify.app/api/cron/daily-update`
     - Schedule: `0 6 * * *` (6 AM daily)
     - Header: `Authorization: Bearer your-cron-secret`

---

### Option 3: Railway

**Best for:** Full-stack apps with database

#### Steps:

1. **Go to Railway**
   - Visit https://railway.app/
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `elcanaoel/predictsport`

3. **Environment Variables**
   Add in Railway dashboard (same as above)

4. **Deploy**
   - Railway auto-deploys
   - Provides a URL

5. **Setup Cron**
   - Use external cron service (cron-job.org)
   - Point to your Railway URL

---

### Option 4: VPS/Cloud Server

**Best for:** Full control, custom setup

#### Platforms:
- DigitalOcean
- AWS EC2
- Google Cloud
- Azure
- Linode

#### Steps:

1. **Clone Repository**
   ```bash
   git clone https://github.com/elcanaoel/predictsport.git
   cd predictsport
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Setup Database**
   ```bash
   npm run db:push
   ```

5. **Build**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "predictsport" -- start
   pm2 start npm --name "predictsport-cron" -- run daily-update
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔐 Environment Variables

**Required for all deployments:**

```env
# Database
DATABASE_URL=file:./dev.db

# API-Football
FOOTBALL_API_KEY=your-api-key-from-api-football
FOOTBALL_API_HOST=v3.football.api-sports.io

# Cron Security
CRON_SECRET=generate-a-random-secret-key

# Environment
NODE_ENV=production
```

**How to get API key:**
1. Visit https://www.api-football.com/
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 100 requests/day

---

## ⚙️ Post-Deployment Setup

### 1. Initial Data Load

After deployment, run these once:

**Via API endpoint:**
```bash
curl -X GET https://your-site.com/api/cron/daily-update \
  -H "Authorization: Bearer your-cron-secret"
```

**Or SSH into server:**
```bash
npm run update-matches
npm run generate-predictions
```

### 2. Verify Cron is Working

**Vercel:** Check deployment logs
**Others:** Check cron-job.org execution history

### 3. Test the Site

Visit your deployed URL and check:
- ✅ Home page loads
- ✅ Matches are displayed
- ✅ Predictions show up
- ✅ Click "All Predictions" works
- ✅ Live scores page works

---

## 📊 Monitoring

### Check Deployment Status

**Vercel:**
- Dashboard → Your Project → Deployments
- View logs for cron executions

**Netlify:**
- Dashboard → Site → Deploys
- Check function logs

**VPS:**
```bash
pm2 status
pm2 logs predictsport
pm2 logs predictsport-cron
```

### Check Database

**Vercel/Netlify:**
- Database is ephemeral (resets on deploy)
- Consider using external database (PlanetScale, Supabase)

**VPS:**
```bash
npm run db:studio
```

---

## 🔄 Updating Your Site

### Push Updates

```bash
git add .
git commit -m "Your update message"
git push origin main
```

**Vercel/Netlify:** Auto-deploys on push
**Railway:** Auto-deploys on push
**VPS:** Manual pull and restart:
```bash
git pull origin main
npm install
npm run build
pm2 restart predictsport
```

---

## 🆘 Troubleshooting

### Site not loading
- Check environment variables are set
- Check build logs for errors
- Verify Node.js version (18+)

### No predictions showing
- Check API key is valid
- Run initial data load
- Check cron is executing

### Database errors
- Ensure DATABASE_URL is set
- Run `npm run db:push`
- Check file permissions (VPS)

### Cron not running
- Verify CRON_SECRET matches
- Check cron service is configured
- Test endpoint manually

---

## 💰 Cost Estimates

| Platform | Free Tier | Paid |
|----------|-----------|------|
| **Vercel** | ✅ Hobby (personal projects) | $20/mo Pro |
| **Netlify** | ✅ 100GB bandwidth | $19/mo Pro |
| **Railway** | $5 credit/mo | Pay as you go |
| **DigitalOcean** | ❌ | $6/mo droplet |
| **API-Football** | ✅ 100 req/day | $10/mo+ |

**Recommended for starting:** Vercel Free Tier + API-Football Free

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] API key added and tested
- [ ] CRON_SECRET generated
- [ ] Initial data loaded
- [ ] Cron job configured
- [ ] Site loads correctly
- [ ] Predictions showing
- [ ] Live scores working
- [ ] Mobile responsive
- [ ] Domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up

---

## 🌟 Next Steps

1. **Deploy to Vercel** (easiest option)
2. **Add your API key**
3. **Run initial data load**
4. **Share your site!**

Your sports prediction platform is ready for the world! 🚀

---

**Repository:** https://github.com/elcanaoel/predictsport
**Documentation:** All guides included in repo
**Support:** Check documentation files in repository
