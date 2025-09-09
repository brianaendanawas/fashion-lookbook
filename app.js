const grid = document.getElementById('grid');
const search = document.getElementById('search');
const category = document.getElementById('category');
const loadMoreBtn = document.getElementById('loadMore');

let allItems = [];
let visibleCount = 8;

async function loadData(){
  const res = await fetch('data/data.json', { cache: 'no-store' });
  allItems = await res.json();
  render();
}

function matches(item){
  const q = (search.value || '').trim().toLowerCase();
  const cat = category.value;
  const text = [item.title, ...(item.tags||[]), item.category].join(' ').toLowerCase();
  return (!cat || item.category === cat) && (!q || text.includes(q));
}

function render(){
  const filtered = allItems.filter(matches);
  const items = filtered.slice(0, visibleCount);
  grid.innerHTML = items.length
    ? items.map(cardHTML).join('')
    : `<p style="opacity:.7">No looks found. Try a different search or category.</p>`;
  loadMoreBtn.classList.toggle('hidden', visibleCount >= filtered.length);
}

function cardHTML(item){
  return `
    <article class="card">
      <img loading="lazy" src="${item.image}" alt="${item.title}">
      <div class="meta">
        <div>${item.title}</div>
        <span class="tag">${item.category}</span>
      </div>
    </article>`;
}

search.addEventListener('input', () => { visibleCount = 8; render(); });
category.addEventListener('change', () => { visibleCount = 8; render(); });
loadMoreBtn.addEventListener('click', () => { visibleCount += 8; render(); });

loadData();
