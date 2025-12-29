# 📸 How to Update Images - Step by Step Guide

## Quick Steps

### Step 1: Replace Clinic Photo (Home Page)

1. **Find your new clinic interior photo** (the one showing the waiting area, reception desk, etc.)
2. **Rename it to:** `clinic.jpg`
3. **Copy it to:** `public/brand/clinic.jpg` (replace the existing file)
4. **That's it!** The home page will automatically show the new image.

### Step 2: Add Team Photo (About Page)

1. **Find your team/group photo** (the one with ~20 people in white t-shirts)
2. **Rename it to:** `team.jpg`
3. **Copy it to:** `public/brand/team.jpg` (new file)
4. **That's it!** The About page will automatically show it.

## File Locations

```
Your Project Folder
└── public
    └── brand
        ├── clinic.jpg    ← REPLACE this file with your new clinic photo
        ├── team.jpg      ← ADD this new file (your team photo)
        └── happy-optics-logo.png
```

## Image Requirements

### Clinic Photo (`clinic.jpg`)
- **Format:** JPG or PNG
- **Size:** 1920x1080px or larger
- **File size:** Under 2MB recommended
- **Content:** Your new clinic interior photo

### Team Photo (`team.jpg`)
- **Format:** JPG or PNG  
- **Size:** 1920x1080px or larger
- **File size:** Under 2MB recommended
- **Content:** Your team/group photo

## After Adding Images

1. **Save the files** in the correct location
2. **Restart your dev server** if it's running:
   - Stop: Press `Ctrl+C` in terminal
   - Start: Run `npm run dev`
3. **Refresh your browser** (hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`)

## Troubleshooting

### Images not showing?
- ✅ Check file names are exactly: `clinic.jpg` and `team.jpg` (lowercase)
- ✅ Check files are in `public/brand/` folder
- ✅ Restart the dev server
- ✅ Clear browser cache (hard refresh)

### Still not working?
- Check browser console for errors
- Verify file paths are correct
- Make sure images are valid JPG/PNG files

## Current Status

✅ Code is ready - images will display automatically once you add them!
✅ Home page: Will show new clinic photo
✅ About page: Will show clinic photo + new team photo

Just add the image files and you're done! 🎉

