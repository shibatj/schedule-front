document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkerForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingDiv = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const tableBody = document.getElementById('tableBody');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        const courseCode = document.getElementById('courseCode').value;
        
        // เช็คสถานะ Checkbox ว่าจะดึงจาก Database หรือ Force Update จากเว็บ
        const isForceUpdate = document.getElementById('forceUpdate').checked;

        submitBtn.disabled = true;
        submitBtn.textContent = 'กำลังตรวจสอบ...';
        resultContainer.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        tableBody.innerHTML = '';

        try {
            // ✅ เปลี่ยน URL เป็นชื่อโปรเจกต์ที่คุณตั้งใน Render เรียบร้อยแล้ว
            const apiUrl = 'https://hcu-assignment-api.onrender.com/api/check_assignments';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    password: password,
                    course_code: courseCode,
                    force_update: isForceUpdate
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
            }

            renderTable(result.data);
            
            loadingDiv.classList.add('hidden');
            resultContainer.classList.remove('hidden');

        } catch (error) {
            alert('❌ ข้อผิดพลาด: ' + error.message);
            loadingDiv.classList.add('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'เช็คงานเลย';
        }
    });

    function renderTable(data) {
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center;">ไม่พบข้อมูลงานในวิชานี้</td></tr>';
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            
            const statusHtml = item.submitted 
                ? '<span class="status-done">ส่งแล้ว</span>' 
                : '<span class="status-pending">ยังไม่ส่ง</span>';

            tr.innerHTML = `
                <td>${item.course_name}</td>
                <td><a href="${item.url}" target="_blank">${item.title}</a></td>
                <td>${statusHtml}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
});
