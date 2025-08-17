# Test URLs for EmailJS Parameter Debugging

## Manual Test URLs

These URLs can be used to manually test the feedback page parameter validation:

### ✅ Working Test URLs (All Parameters Present)

**Korean Test URL:**
```
https://korean-mbti-platform.netlify.app/ko/feedback/test123?token=abc123def456&name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
```

**English Test URL:**
```
https://korean-mbti-platform.netlify.app/en/feedback/test123?token=abc123def456&name=Test%20User&testId=feedback-360&testResultId=result123456&email=test@example.com
```

### ❌ Broken Test URLs (Missing Parameters)

**Missing Token:**
```
https://korean-mbti-platform.netlify.app/ko/feedback/test123?name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
```

**Missing Name:**
```
https://korean-mbti-platform.netlify.app/ko/feedback/test123?token=abc123def456&testId=feedback-360&testResultId=result123456&email=test@example.com
```

**Missing Multiple Parameters:**
```
https://korean-mbti-platform.netlify.app/ko/feedback/test123?token=abc123def456&name=김수님
```

## Testing Instructions

1. **Click working URLs** - Should load feedback form successfully
2. **Click broken URLs** - Should show specific error message with missing parameters
3. **Check browser console** - Should see enhanced debug logging:
   - "=== FEEDBACK PAGE URL DEBUG ==="
   - Individual parameter status with ✓ or ❌ indicators

## Expected Console Output

### For Working URL:
```
=== FEEDBACK PAGE URL DEBUG ===
Full URL: https://korean-mbti-platform.netlify.app/ko/feedback/test123?token=abc123def456&name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
Search params string: ?token=abc123def456&name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
Individual parameters:
  ✓ name: "김수님"
  ✓ testId: "feedback-360"
  ✓ testResultId: "result123456"
  ✓ email: "test@example.com"
  ✓ token: "abc123def456"
=== END URL DEBUG ===
```

### For Broken URL (Missing Token):
```
=== FEEDBACK PAGE URL DEBUG ===
Full URL: https://korean-mbti-platform.netlify.app/ko/feedback/test123?name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
Search params string: ?name=김수님&testId=feedback-360&testResultId=result123456&email=test@example.com
Individual parameters:
  ✓ name: "김수님"
  ✓ testId: "feedback-360"
  ✓ testResultId: "result123456"
  ✓ email: "test@example.com"
  ❌ token: MISSING
=== END URL DEBUG ===
```

## Next Steps

1. Test the working URLs to confirm enhanced debugging is live
2. Use broken URLs to verify error handling works correctly  
3. When user reports issues, ask them to check console for debug output
4. Compare console output from emailJS sending vs. actual received URL