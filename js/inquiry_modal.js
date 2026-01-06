document.addEventListener('DOMContentLoaded', function() {
  initInquirySystem();
});

function initInquirySystem() {
  // 1. Inject Modal HTML
  const modalHTML = `
    <div id="inquiry-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" onclick="closeInquiryModal()">×</button>
        <div class="modal-header">
          <h3>🍷 酒款詢價 Inquiry</h3>
        </div>
        
        <div class="wine-details" id="modal-wine-info">
          <!-- Wine info populated via JS -->
        </div>

        <form id="inquiry-form" onsubmit="handleInquirySubmit(event)">
          <div class="form-group">
            <label for="customer-name">姓名 (Name) *</label>
            <input type="text" id="customer-name" required placeholder="請輸入您的姓名">
          </div>
          
          <div class="form-group">
            <label for="customer-phone">電話 (Phone) *</label>
            <input type="tel" id="customer-phone" required placeholder="請輸入聯絡電話">
          </div>

          <div class="form-group">
            <label for="customer-email">Email *</label>
            <input type="email" id="customer-email" required placeholder="請輸入 Email">
          </div>

          <button type="submit" class="submit-btn">送出詢價 (Send Inquiry)</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 2. Modify Tables
  const tables = document.querySelectorAll('.wine-table');
  tables.forEach(table => {
    // Add Header
    const theadRow = table.querySelector('thead tr');
    if (theadRow) {
      const th = document.createElement('th');
      th.textContent = '詢價';
      theadRow.appendChild(th);
    }

    // Add Buttons
    const tbodyRows = table.querySelectorAll('tbody tr');
    tbodyRows.forEach(row => {
      const td = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'inquiry-btn';
      btn.textContent = '詢價';
      btn.onclick = () => openInquiryModal(row);
      td.appendChild(btn);
      row.appendChild(td);
    });
  });
}

let currentWineData = {};

function openInquiryModal(row) {
  const wineName = row.querySelector('.wine-name').textContent.trim();
  const chineseName = row.querySelector('.chinese-name') ? row.querySelector('.chinese-name').textContent.trim() : '';
  const vintage = row.querySelector('.vintage').textContent.trim();
  const price = row.querySelector('.price').textContent.trim();

  currentWineData = {
    wineName,
    chineseName,
    vintage,
    price
  };

  const modalInfo = document.getElementById('modal-wine-info');
  modalInfo.innerHTML = `
    <p><strong>酒款:</strong> ${wineName}</p>
    <p><strong>中文:</strong> ${chineseName}</p>
    <p><strong>年份:</strong> ${vintage}</p>
    <p><strong>價格:</strong> ${price}</p>
  `;

  document.getElementById('inquiry-modal').classList.add('active');
}

function closeInquiryModal() {
  document.getElementById('inquiry-modal').classList.remove('active');
}

function handleInquirySubmit(e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value;
  const phone = document.getElementById('customer-phone').value;
  const email = document.getElementById('customer-email').value;

  if (!name || !phone || !email) {
    alert('請填寫所有欄位 (Please fill in all fields)');
    return;
  }

  const recipients = 'dannyho7pyramid@gmail.com,account2@7pyramid.com,cloudia@7pyramid.com';
  const subject = `[詢價 Inquiry] ${currentWineData.wineName} (${currentWineData.vintage})`;
  
  const body = `
    您好，我想詢問以下酒款：
    
    酒款名稱: ${currentWineData.wineName}
    中文名稱: ${currentWineData.chineseName}
    年份: ${currentWineData.vintage}
    參考價格: ${currentWineData.price}
    
    --------------------------------
    客戶資料：
    姓名: ${name}
    電話: ${phone}
    Email: ${email}
    
    請盡快與我聯繫，謝謝。
  `.replace(/^\s+/gm, ''); // Remove leading whitespace for cleaner email body

  const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
  
  // Optional: Close modal or show success message after a delay
  setTimeout(() => {
    closeInquiryModal();
    // Reset form
    document.getElementById('inquiry-form').reset();
  }, 1000);
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('inquiry-modal');
  if (event.target == modal) {
    closeInquiryModal();
  }
}
