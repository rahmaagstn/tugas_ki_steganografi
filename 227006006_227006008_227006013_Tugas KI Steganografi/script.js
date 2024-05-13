// Event listener untuk input file
document.getElementById('imageInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        document.getElementById('originalImage').src = e.target.result;
    };
    
    reader.readAsDataURL(file);
});

function encodeMessage() {
    var imageInput = document.getElementById('imageInput');
    var messageInput = document.getElementById('messageInput').value;
    var originalImage = document.getElementById('originalImage');
    var encodedImage = document.getElementById('encodedImage');

    if (imageInput.files && imageInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;

                var message = messageInput + String.fromCharCode(0); // Tambahkan penanda akhir pesan
                var messageIndex = 0;

                // Teknik substitusi: Ganti nilai piksel gambar untuk menyembunyikan pesan
                for (var i = 0; i < data.length; i += 4) {
                    if (messageIndex < message.length) {
                        var charCode = message.charCodeAt(messageIndex);
                        data[i] = charCode;
                        messageIndex++;
                    } else {
                        break;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                var encodedDataURL = canvas.toDataURL();
                encodedImage.src = encodedDataURL;
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert('Pilih gambar terlebih dahulu.');
    }
}

function decodeMessage() {
    var encodedImage = document.getElementById('encodedImage');
    var decodedOriginalImage = document.getElementById('decodedOriginalImage');
    var decodedMessage = document.getElementById('decodedMessage');

    var canvas = document.createElement('canvas');
    canvas.width = encodedImage.width;
    canvas.height = encodedImage.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(encodedImage, 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var message = '';
    var messageChar = '';
    var messageComplete = false;

    // Metode LSB: Baca bit terkecil dari nilai kanal warna (misalnya, merah) dari setiap piksel gambar untuk mengekstrak pesan
    for (var i = 0; i < data.length; i += 4) {
        if (!messageComplete) {
            var charCode = data[i] & 0xFF; // Ambil bit terkecil
            if (charCode !== 0) {
                messageChar += String.fromCharCode(charCode);
            } else {
                // Jika ditemukan karakter nol, tandanya pesan telah selesai
                messageComplete = true;
            }
        }
    }

    decodedMessage.textContent = 'Pesan Tersembunyi: ' + messageChar;
}

// JavaScript function to show selected page
function showPage(pageId) {
    // Hide all content sections
    var contentSections = document.querySelectorAll('.content > div');
    contentSections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected page
    var selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}