function authenticate(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  fetch('/login', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json()) // JSON 형식으로 응답을 처리
  .then(data => {
    if (data.success) {
      window.location.href = '/dashboard'; // 로그인 성공 시 리다이렉트
    } else {
      alert(data.message || '로그인 실패');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}
