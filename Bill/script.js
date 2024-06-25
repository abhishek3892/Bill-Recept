let itemIndex = 1;

function addItem() {
    itemIndex++;
    const itemsDiv = document.getElementById('items');
    const newItemRow = document.createElement('div');
    newItemRow.className = 'item-row';
    newItemRow.innerHTML = `
        <label for="item${itemIndex}">Item ${itemIndex}:</label>
        <input type="text" id="item${itemIndex}" name="item${itemIndex}" required>
        <label for="quantity${itemIndex}">Quantity ${itemIndex}:</label>
        <input type="number" id="quantity${itemIndex}" name="quantity${itemIndex}" required>
        <label for="unitPrice${itemIndex}">Unit Price ${itemIndex}:</label>
        <input type="number" step="0.01" id="unitPrice${itemIndex}" name="unitPrice${itemIndex}" required>
    `;
    itemsDiv.appendChild(newItemRow);
}

function generateBill() {
    // Get user input values
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const phone = document.getElementById('phone').value;
    const discount = parseFloat(document.getElementById('discount').value) || 0;

    // Display the bill container
    document.getElementById('bill-container').style.display = 'block';

    // Populate the bill details
    document.getElementById('bill-from').textContent = from;
    document.getElementById('bill-to').textContent = to;
    document.getElementById('bill-phone').textContent = phone;

    // Add items to the bill
    const billItems = document.getElementById('bill-items');
    billItems.innerHTML = '';

    let totalAmount = 0;

    for (let i = 1; i <= itemIndex; i++) {
        const item = document.getElementById(`item${i}`).value;
        const quantity = document.getElementById(`quantity${i}`).value;
        const unitPrice = document.getElementById(`unitPrice${i}`).value;
        const totalPrice = quantity * unitPrice;
        totalAmount += totalPrice;

        billItems.innerHTML += `
            <tr>
                <td>${item}</td>
                <td>${quantity}</td>
                <td>${unitPrice}</td>
                <td>${totalPrice.toFixed(2)}</td>
            </tr>
        `;
    }

    // Apply discount
    const discountAmount = totalAmount * (discount / 100);
    totalAmount -= discountAmount;

    document.getElementById('bill-total').textContent = totalAmount.toFixed(2);
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const from = document.getElementById('bill-from').textContent;
    const to = document.getElementById('bill-to').textContent;
    const phone = document.getElementById('bill-phone').textContent;
    const totalAmount = document.getElementById('bill-total').textContent;

    doc.text('Bill Receipt', 20, 20);
    doc.text(`From: ${from}`, 20, 30);
    doc.text(`To: ${to}`, 20, 40);
    doc.text(`Phone: ${phone}`, 20, 50);

    const items = document.getElementById('bill-items').children;
    let yOffset = 60;
    doc.text('Item', 20, yOffset);
    doc.text('Quantity', 70, yOffset);
    doc.text('Unit Price', 120, yOffset);
    doc.text('Total Price', 170, yOffset);

    for (let i = 0; i < items.length; i++) {
        const item = items[i].children;
        yOffset += 10;
        doc.text(item[0].textContent, 20, yOffset);
        doc.text(item[1].textContent, 70, yOffset);
        doc.text(item[2].textContent, 120, yOffset);
        doc.text(item[3].textContent, 170, yOffset);
    }

    yOffset += 20;
    doc.text(`Total Amount: ${totalAmount}`, 20, yOffset);

    doc.save('bill_receipt.pdf');
}

function printBill() {
    const printContents = document.getElementById('bill-container').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
    window.location.reload();
}
