// Theme toggle injected logo button
(function(){
  const STORAGE_KEY = 'adit:theme';
  const ICON_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>`;

  function setTheme(theme){
    const html = document.documentElement;
    if(theme === 'dark'){
      html.classList.add('dark');
      html.setAttribute('data-theme','dark');
    } else if(theme === 'light'){
      html.classList.remove('dark');
      html.setAttribute('data-theme','light');
    }
    try{ localStorage.setItem(STORAGE_KEY, theme); }catch(e){}
  }

  function initTheme(){
    try{
      const saved = localStorage.getItem(STORAGE_KEY);
      if(saved) return setTheme(saved);
    }catch(e){}
    // Respect OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  function createButton(){
    const btn = document.createElement('button');
    btn.setAttribute('aria-label','Toggle theme');
    btn.innerHTML = ICON_SVG;
    btn.className = 'theme-logo-toggle fixed z-50 right-4 bottom-6 w-10 h-10 flex items-center justify-center bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-800 rounded-full backdrop-blur-sm';
    btn.style.transition = 'transform 150ms ease';
    btn.addEventListener('click', ()=>{
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
      // small click pop
      btn.style.transform = 'scale(0.95)';
      setTimeout(()=> btn.style.transform = 'scale(1)', 120);
    });
    // keyboard focus styles
    btn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    document.body.appendChild(btn);
  }

  // init
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    initTheme(); createButton();
  } else {
    window.addEventListener('DOMContentLoaded', ()=>{ initTheme(); createButton(); });
  }
})();
