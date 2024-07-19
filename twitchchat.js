function replaceChatWithTwitch() {
  // Znajdź kontener chatu
  var chatContainer = document.getElementById('chatwrap');
  
  if (chatContainer) {
    // Usuń istniejącą zawartość
    chatContainer.innerHTML = '';
    
    // Stwórz nowy element iframe dla chatu Twitch
    var twitchChat = document.createElement('iframe');
    twitchChat.src = 'https://www.twitch.tv/embed/asialols/chat?parent=cytu.be';
    twitchChat.width = '100%';
    twitchChat.height = '100%';
    twitchChat.frameBorder = '0';
    
    // Dodaj chat Twitch do kontenera
    chatContainer.appendChild(twitchChat);
  }
}

// Wywołaj funkcję po załadowaniu strony
window.addEventListener('load', replaceChatWithTwitch);
