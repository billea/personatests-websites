// Manual verification script for Korean translations
// Run this in the browser console after switching to Korean

console.log('🔍 KOREAN TRANSLATION VERIFICATION SCRIPT');
console.log('==========================================');

// Check if we're in Korean mode
if (typeof currentLanguage !== 'undefined') {
    console.log('Current language:', currentLanguage);
} else {
    console.log('⚠️ currentLanguage not defined');
}

// Check Korean translations object
if (typeof translations !== 'undefined' && translations.ko) {
    console.log('✅ Korean translations object exists');
    console.log('Korean test titles available:');
    if (translations.ko.tests) {
        console.log('  MBTI:', translations.ko.tests.mbti?.title);
        console.log('  Big Five:', translations.ko.tests.bigfive?.title);
        console.log('  Love Language:', translations.ko.tests.lovelanguage?.title);
    }
} else {
    console.log('❌ Korean translations not found');
}

// Check current test card titles
console.log('\n📋 CURRENT TEST CARD TITLES:');
const testCards = document.querySelectorAll('.test-card h3');
testCards.forEach((card, index) => {
    const text = card.textContent;
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
    const dataTranslate = card.getAttribute('data-translate');
    console.log(`${index + 1}. "${text}" [${dataTranslate}] ${hasKorean ? '🇰🇷' : '🇺🇸'}`);
});

// Expected Korean translations
const expectedKorean = [
    '16가지 성격 유형',
    '빅파이브 성격 검사', 
    '사랑의 언어 테스트',
    '두뇌 테스트',
    '감성지능',
    '집중력과 에너지 스타일',
    '스트레스 관리 스타일',
    '감정 조절 스타일',
    '캐릭터 강점 (VIA)',
    '진로 탐색기',
    '연애 스타일'
];

console.log('\n🎯 EXPECTED KOREAN TRANSLATIONS CHECK:');
expectedKorean.forEach((korean, index) => {
    const found = document.querySelector(`h3:contains("${korean}")`);
    console.log(`${index + 1}. "${korean}": ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
});

// Check if Korean fix functions exist
console.log('\n🔧 KOREAN FIX FUNCTIONS:');
console.log('applyKoreanTranslationFix:', typeof applyKoreanTranslationFix !== 'undefined' ? '✅' : '❌');
console.log('applyManualKoreanTestCardTitles:', typeof applyManualKoreanTestCardTitles !== 'undefined' ? '✅' : '❌');
console.log('verifyKoreanTranslations:', typeof verifyKoreanTranslations !== 'undefined' ? '✅' : '❌');

console.log('\n📝 To test the fix:');
console.log('1. Switch to Korean: changeLanguage("ko")');
console.log('2. Navigate to Know Yourself: showCategory("know-yourself")');
console.log('3. Run verification: verifyKoreanTranslations()');