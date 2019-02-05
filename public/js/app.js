$(document).ready(() => {
  console.log('Document ready!');

  $('.login-frm').on('submit', function(event) {
    console.log('on submit');

    event.preventDefault();

    // extracting the email
    const email = $(this)
      .find('input[name=email]')
      .val();
    const password = $(this)
      .find('input[name=password]')
      .val();

    const options = {
      url: 'http://localhost:3000/api/login',
      method: 'POST',
      data: { email, password },
    };

    $.ajax(options)
      .done(result => {
        localStorage.setItem('token', result.token);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  });

  $('.users-btn').on('click', function(event) {
    console.log('button click');
    event.preventDefault();

    const token = localStorage.getItem('token');

    const options = {
      url: 'http://localhost:3000/api/users',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      dataType: 'json',
    };

    $.ajax(options)
      .done(result => {
        console.log(result);
      })
      .catch(err => {
        console.log('err:', err);
      });
  });
});
