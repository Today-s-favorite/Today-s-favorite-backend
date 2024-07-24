async function join(event) {
    event.preventDefault();
  
    const form = document.getElementById('signup');
    const formData = new FormData(form);
  
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('회원가입이 성공적으로 처리되었습니다.');
        window.location.href = '/login'; // 회원가입 성공 시 로그인 페이지로 리다이렉트
      } else {
        alert(result.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  }
  