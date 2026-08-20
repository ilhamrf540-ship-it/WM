// Whats Massage Application Logic - FULLY ACTIVATED FEATURES WITH LOCAL STORAGE PERSISTENCE

// Default Mock Contacts Database
const DEFAULT_CONTACTS = [
  {
    id: 1,
    name: "Alia Bhatt",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    phone: "+62 811-9922-883",
    statusMessage: "Busy in shoot. Talk later!",
    online: true,
    unreadCount: 2,
    messages: [
      { text: "Hey! Did you check out the new design of Whats Massage?", sender: "received", time: "08:05 AM" },
      { text: "It looks incredibly sleek and modern!", sender: "received", time: "08:06 AM" }
    ],
    statusStories: [
      { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80", caption: "Morning walk by the beach!", time: "2 hours ago" }
    ]
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    phone: "+62 812-4455-667",
    statusMessage: "Available",
    online: false,
    unreadCount: 0,
    messages: [
      { text: "Are we meeting today for the demo?", sender: "received", time: "Yesterday" },
      { text: "Yes, at 2 PM in the main office.", sender: "sent", time: "Yesterday" },
      { text: "Great, see you there!", sender: "received", time: "Yesterday" }
    ],
    statusStories: []
  },
  {
    id: 3,
    name: "Sarah Connor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    phone: "+62 856-7788-990",
    statusMessage: "No fate but what we make.",
    online: true,
    unreadCount: 0,
    messages: [
      { text: "The system is online. Be careful.", sender: "received", time: "Monday" }
    ],
    statusStories: [
      { image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80", caption: "Escape into nature 🏔️", time: "4 hours ago" }
    ]
  },
  {
    id: 4,
    name: "Tony Stark",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    phone: "+62 888-3000-3000",
    statusMessage: "I love you 3000.",
    online: true,
    unreadCount: 1,
    messages: [
      { text: "Kid, did you finish coding the new feature?", sender: "received", time: "07:30 AM" }
    ],
    statusStories: [
      { image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80", caption: "Working on Mark LXXXV", time: "1 hour ago" }
    ]
  }
];

// Active State
let contacts = [];
let currentChatId = null;
let currentTab = 'chats'; // 'chats' or 'status'
let pendingInvite = null;
let isDarkMode = true;
let localStream = null;
let myStatusStories = [];
let mqttClient = null;

// Media Recording States
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;

// DOM Elements
const sidebarList = document.getElementById('sidebar-list');
const searchInput = document.getElementById('search-input');
const tabChats = document.getElementById('tab-chats');
const tabStatus = document.getElementById('tab-status');
const statusPicInput = document.getElementById('status-pic-input');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const chatEmptyState = document.getElementById('chat-empty-state');
const chatActiveContainer = document.getElementById('chat-active-container');

// Chat Active Window Info
const activeChatAvatar = document.getElementById('active-chat-avatar');
const activeChatName = document.getElementById('active-chat-name');
const activeChatStatus = document.getElementById('active-chat-status');
const messagesFeed = document.getElementById('messages-feed');
const messageInputField = document.getElementById('message-input-field');
const sendMessageBtn = document.getElementById('send-message-btn');
const sendIcon = document.getElementById('send-icon');
const chatBody = document.querySelector('.chat-body');

// Settings Elements
const myProfileBtn = document.getElementById('my-profile-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const settingsProfileImg = document.getElementById('settings-profile-img');
const profilePicChangeBtn = document.getElementById('profile-pic-change-btn');
const profilePicInput = document.getElementById('profile-pic-input');
const customBgUrl = document.getElementById('custom-bg-url');
const applyCustomBgBtn = document.getElementById('apply-custom-bg-btn');

// Auth Screen Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const authTabSignin = document.getElementById('auth-tab-signin');
const authTabSignup = document.getElementById('auth-tab-signup');
const signinForm = document.getElementById('signin-form');
const signupContainer = document.getElementById('signup-container');
const signinPhone = document.getElementById('signin-phone');
const signinPassword = document.getElementById('signin-password');
const signupStepPhone = document.getElementById('signup-step-phone');
const signupStepOtp = document.getElementById('signup-step-otp');
const signupStepProfile = document.getElementById('signup-step-profile');
const signupPhone = document.getElementById('signup-phone');
const btnSendOtp = document.getElementById('btn-send-otp');
const signupOtpInput = document.getElementById('signup-otp-input');
const btnVerifyOtp = document.getElementById('btn-verify-otp');
const signupName = document.getElementById('signup-name');
const signupPassword = document.getElementById('signup-password');
const btnFinishSignup = document.getElementById('btn-finish-signup');
const logoutBtn = document.getElementById('logout-btn');
const copyInviteLinkBtn = document.getElementById('copy-invite-link-btn');
const smsBanner = document.getElementById('sms-banner');
const smsBannerMessage = document.getElementById('sms-banner-message');

// New Chat Modal Elements
const newChatBtn = document.getElementById('new-chat-btn');
const newContactModal = document.getElementById('new-contact-modal');
const newContactName = document.getElementById('new-contact-name');
const newContactPhone = document.getElementById('new-contact-phone');
const cancelNewContactBtn = document.getElementById('cancel-new-contact-btn');
const saveNewContactBtn = document.getElementById('save-new-contact-btn');

// Group Modal Elements
const openGroupModalBtn = document.getElementById('open-group-modal-btn');
const groupCreateModal = document.getElementById('group-create-modal');
const newGroupName = document.getElementById('new-group-name');
const groupContactsList = document.getElementById('group-contacts-list');
const cancelGroupBtn = document.getElementById('cancel-group-btn');
const saveGroupBtn = document.getElementById('save-group-btn');

// Info Panel Actions
const infoMuteBtn = document.getElementById('info-mute-btn');
const infoMuteLabel = document.getElementById('info-mute-label');
const infoClearBtn = document.getElementById('info-clear-btn');
const infoDeleteBtn = document.getElementById('info-delete-btn');

// Emoji & Sticker Picker Elements
const emojiBtn = document.getElementById('emoji-btn');
const emojiStickerPicker = document.getElementById('emoji-sticker-picker');
const pickerTabEmojis = document.getElementById('picker-tab-emojis');
const pickerTabStickers = document.getElementById('picker-tab-stickers');
const pickerEmojisContainer = document.getElementById('picker-emojis-container');
const pickerStickersContainer = document.getElementById('picker-stickers-container');

// Attachment Drawer Elements
const attachBtn = document.getElementById('attach-btn');
const attachDropdown = document.getElementById('attach-dropdown');
const attachFileOpt = document.getElementById('attach-file-opt');
const attachLocationOpt = document.getElementById('attach-location-opt');
const fileInput = document.getElementById('file-input');

// Info Panel Details
const contactInfoPanel = document.getElementById('contact-info-panel');
const infoToggleBtn = document.getElementById('info-toggle-btn');
const closeInfoBtn = document.getElementById('close-info-btn');
const infoPanelAvatar = document.getElementById('info-panel-avatar');
const infoPanelName = document.getElementById('info-panel-name');
const infoPanelPhone = document.getElementById('info-panel-phone');
const infoPanelStatusMsg = document.getElementById('info-panel-status-msg');

// Call Overlay Details
const callOverlay = document.getElementById('call-overlay');
const callAudioBtn = document.getElementById('call-audio-btn');
const callVideoBtn = document.getElementById('call-video-btn');
const callAvatar = document.getElementById('call-avatar');
const callName = document.getElementById('call-name');
const callStatusLabel = document.getElementById('call-status-label');
const btnCallEnd = document.getElementById('btn-call-end');
const callTypeIcon = document.getElementById('call-type-icon');
const videoStreamContainer = document.getElementById('video-stream-container');
const localVideo = document.getElementById('local-video');
const callMicBtn = document.getElementById('call-mic-btn');
const callVideoToggleBtn = document.getElementById('call-video-toggle-btn');

// Story Viewer Details
const storyOverlay = document.getElementById('story-overlay');
const closeStoryBtn = document.getElementById('close-story-btn');
const storyUserAvatar = document.getElementById('story-user-avatar');
const storyUserName = document.getElementById('story-user-name');
const storyTime = document.getElementById('story-time');
const storyContentImage = document.getElementById('story-content-image');
const storyCaptionText = document.getElementById('story-caption-text');
const storyProgressContainer = document.getElementById('story-progress-container');

// Auto reply responses
const replyResponses = [
  "Nice! I really like how fast Whats Massage is running.",
  "That sounds interesting! Let's talk more in a voice call.",
  "Absolutely. Let's make sure it looks beautiful.",
  "Understood. Let me look into this and get back to you soon.",
  "Haha indeed! Whats Massage is definitely the best."
];

const EMOJIS = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕'];
const STICKERS = [
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHl0ajYxMmt0Z3V6YWpsa3Nidmdtczhrb3VsbjM1OTdrcDZ0dW9wOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/MDJ9IbhswvE52/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXNvdXhyOXltMXhvbzdkMDNsNnptanAwcG44Mmc1MHBpNXk2dnRybiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcC2EA/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2RvdWlzdmhjeWJqbmZ1N2xtZHNqNHltN2d1bnh0OXE2MTVyZHBjMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/GeimqsH0TLDt4tScGw/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWcwaHNwbms0eW54M3Yxa2tsN3dzZWNkNmJtZHpxMjl6bXkycjdxdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/YRtLgsajXrz1JaN6qi/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWRuM3o2dDRpdGF1Z3lzcjN3Z3IydnRxMzZpdWRhcjBpaHhuMmhyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Z1wPEf6l4fDcA/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHM5aHFuODNqYnF5ejBwbXRkZXg4NzA5N2U1bGV2aDFwdHBpdWdkbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/A13yIu3sWpC0M/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWV6OWc3d2U5enBvYTlscHA0dWF5eHJhOWtqaDFsZGVvZHc4eDJ6ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/mCRJDo24UvJMA/giphy.gif',
  'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHJ1cHd5ZHphdmhtc2FndDVwdDZobTgwazV4aGJ2dWlyeWJ6NmcxMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/81lS25sV0bVf2/giphy.gif'
];

// Initialize application
function init() {
  // Parse URL invite query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const invitePhone = urlParams.get('invite_phone');
  const inviteName = urlParams.get('invite_name');
  if (invitePhone && inviteName) {
    pendingInvite = { phone: invitePhone, name: inviteName };
  }

  // Load contacts database from local storage
  const storedContacts = localStorage.getItem('wm_contacts');
  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  } else {
    contacts = DEFAULT_CONTACTS;
  }

  // Load user status
  const storedStatus = localStorage.getItem('wm_my_status');
  myStatusStories = storedStatus ? JSON.parse(storedStatus) : [];

  // Set default theme setup
  document.body.setAttribute('data-theme', 'dark');

  // Load custom wallpaper or custom background color
  const storedBgColor = localStorage.getItem('wm_wallpaper_color');
  const storedBgImage = localStorage.getItem('wm_wallpaper_image');
  if (storedBgImage && storedBgImage !== 'none') {
    chatBody.style.backgroundImage = storedBgImage;
    chatBody.style.backgroundSize = 'cover';
    chatBody.style.backgroundPosition = 'center';
  } else if (storedBgColor) {
    chatBody.style.backgroundColor = storedBgColor;
    document.documentElement.style.setProperty('--bg-chat-body', storedBgColor);
  }

  // Load user profile picture
  const storedProfilePic = localStorage.getItem('wm_my_profile_pic');
  if (storedProfilePic) {
    myProfileBtn.src = storedProfilePic;
    settingsProfileImg.src = storedProfilePic;
  }

  renderList();
  populatePicker();
  setupEventListeners();

  // Hide splash screen after 2 seconds and display Auth gate or App container
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.classList.add('hidden');
        checkAuthSession();
      }, 500); // Wait for transition fade
    }
  }, 2000);
}

// Check Authentication Session
function checkAuthSession() {
  const isLoggedIn = localStorage.getItem('wm_logged_in') === 'true';
  if (isLoggedIn) {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // Load current user profile details
    const userAccount = JSON.parse(localStorage.getItem('wm_user_account'));
    if (userAccount) {
      document.getElementById('settings-profile-name').textContent = userAccount.name;
      document.getElementById('settings-profile-phone').textContent = userAccount.phone;
      connectMqtt(userAccount.phone);
    }

    // Process invite links if any
    handlePendingInvite();
  } else {
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
  }
}

// Local Storage Helper
function saveToStorage() {
  localStorage.setItem('wm_contacts', JSON.stringify(contacts));
  localStorage.setItem('wm_my_status', JSON.stringify(myStatusStories));
  localStorage.setItem('wm_my_profile_pic', myProfileBtn.src);
  localStorage.setItem('wm_wallpaper_color', chatBody.style.backgroundColor);
  localStorage.setItem('wm_wallpaper_image', chatBody.style.backgroundImage);
}

// Render left sidebar items
function renderList() {
  sidebarList.innerHTML = '';
  const searchVal = searchInput.value.toLowerCase();

  if (currentTab === 'chats') {
    const filtered = contacts.filter(c => c.name.toLowerCase().includes(searchVal));
    if (filtered.length === 0) {
      sidebarList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No chats found</div>`;
      return;
    }

    filtered.forEach(contact => {
      const lastMsg = contact.messages[contact.messages.length - 1];
      const timeStr = lastMsg ? lastMsg.time : '';
      let textStr = 'Start chatting';
      if (lastMsg) {
        if (lastMsg.type === 'image') textStr = '📷 Photo';
        else if (lastMsg.type === 'document') textStr = '📄 Document';
        else if (lastMsg.type === 'audio') textStr = '🎵 Voice Note';
        else if (lastMsg.type === 'location') textStr = '📍 Location';
        else textStr = lastMsg.text;
      }
      
      const unreadBadge = contact.unreadCount > 0 ? `<span class="badge-unread">${contact.unreadCount}</span>` : '';
      const onlineBadge = contact.online ? `<span class="online-badge"></span>` : '';
      const isActive = currentChatId === contact.id ? 'active' : '';
      const muteIcon = contact.muted ? `<i class="fa-solid fa-volume-xmark" style="color: var(--text-secondary); margin-left: 6px; font-size: 12px;"></i>` : '';

      const phoneLabel = (contact.type !== 'group' && contact.phone) ? `<span style="font-size: 11px; font-weight: normal; color: var(--text-secondary); margin-top: 2px; display: block;">${contact.phone}</span>` : '';

      const item = document.createElement('div');
      item.className = `list-item ${isActive}`;
      item.onclick = () => selectChat(contact.id);
      item.innerHTML = `
        <div class="item-avatar-wrapper">
          <img src="${contact.avatar}" alt="${contact.name}" class="item-avatar">
          ${onlineBadge}
        </div>
        <div class="item-details">
          <div class="item-header">
            <span class="item-name" style="display: flex; flex-direction: column;">
              <span>${contact.name}${muteIcon}</span>
              ${phoneLabel}
            </span>
            <span class="item-time">${timeStr}</span>
          </div>
          <div class="item-subcontent">
            <span class="item-message">${textStr}</span>
            ${unreadBadge}
          </div>
        </div>
      `;
      sidebarList.appendChild(item);
    });
  } else {
    // Status stories tab
    // Add My Status item at top of status tab list
    const myStatusItem = document.createElement('div');
    myStatusItem.className = 'list-item';
    myStatusItem.onclick = () => {
      if (myStatusStories.length > 0) {
        openStory({ name: 'My Status', avatar: myProfileBtn.src, statusStories: myStatusStories });
      } else {
        statusPicInput.click();
      }
    };

    const myStatusRing = myStatusStories.length > 0 ? '<div class="status-ring"></div>' : '';
    const plusIcon = myStatusStories.length === 0 ? '<div style="position: absolute; bottom: 0; right: 0; background-color: var(--accent-color); border: 2px solid var(--bg-sidebar); border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-plus" style="color: white; font-size: 10px;"></i></div>' : '';

    myStatusItem.innerHTML = `
      <div class="item-avatar-wrapper">
        <img src="${myProfileBtn.src}" alt="My Status" class="item-avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">
        ${myStatusRing}
        ${plusIcon}
      </div>
      <div class="item-details">
        <div class="item-header">
          <span class="item-name">My Status</span>
        </div>
        <div class="item-subcontent">
          <span class="item-message">${myStatusStories.length > 0 ? myStatusStories[0].time : 'Tap to add status update'}</span>
        </div>
      </div>
    `;
    sidebarList.appendChild(myStatusItem);

    const filtered = contacts.filter(c => c.statusStories.length > 0 && c.name.toLowerCase().includes(searchVal));
    filtered.forEach(contact => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.onclick = () => openStory(contact);
      item.innerHTML = `
        <div class="item-avatar-wrapper">
          <img src="${contact.avatar}" alt="${contact.name}" class="item-avatar">
          <div class="status-ring"></div>
        </div>
        <div class="item-details">
          <div class="item-header">
            <span class="item-name">${contact.name}</span>
          </div>
          <div class="item-subcontent">
            <span class="item-message">${contact.statusStories[0].time}</span>
          </div>
        </div>
      `;
      sidebarList.appendChild(item);
    });
  }
}

// Select chat
function selectChat(id) {
  currentChatId = id;
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  contact.unreadCount = 0; // mark as read
  saveToStorage();

  // Hide empty state and show chat container
  chatEmptyState.classList.add('hidden');
  chatActiveContainer.classList.remove('hidden');

  // Update header details
  activeChatAvatar.src = contact.avatar;
  activeChatName.textContent = contact.name;
  activeChatStatus.textContent = contact.type === 'group' ? 'group chat' : `${contact.online ? 'online' : 'offline'} • ${contact.phone}`;

  // Render messages
  renderMessages(contact);

  // Update contact info details
  infoPanelAvatar.src = contact.avatar;
  infoPanelName.textContent = contact.name;
  infoPanelPhone.textContent = contact.phone;
  infoPanelStatusMsg.textContent = contact.statusMessage;

  // Update mute UI status
  infoMuteLabel.textContent = contact.muted ? 'Unmute Notifications' : 'Mute Notifications';

  // Refresh sidebar list
  renderList();
  
  // Reset message input and icon
  messageInputField.value = '';
  updateInputIcon();
}

// Render message bubbles
function renderMessages(contact) {
  messagesFeed.innerHTML = '';
  contact.messages.forEach((msg, idx) => {
    const row = document.createElement('div');
    row.className = `message-row ${msg.sender}`;
    
    const doubleCheck = msg.sender === 'sent' ? `<i class="fa-solid fa-check-double"></i>` : '';

    let contentHtml = `<div class="message-text">${msg.text}</div>`;
    if (msg.type === 'image') {
      contentHtml = `<img src="${msg.fileUrl}" class="media-image" alt="Shared image" onclick="window.open('${msg.fileUrl}')">`;
      if (msg.text) {
        contentHtml += `<div class="message-text" style="margin-top: 6px;">${msg.text}</div>`;
      }
    } else if (msg.type === 'document') {
      contentHtml = `
        <a href="${msg.fileUrl}" download="${msg.fileName}" class="media-doc">
          <i class="fa-solid fa-file-pdf"></i>
          <div style="min-width: 0; flex: 1;">
            <div style="font-weight: 600; font-size: 13px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${msg.fileName}</div>
            <div style="font-size: 11px; opacity: 0.7;">${msg.fileSize || 'Unknown size'}</div>
          </div>
          <i class="fa-solid fa-arrow-down-long" style="font-size: 14px;"></i>
        </a>
      `;
    } else if (msg.type === 'audio') {
      contentHtml = `
        <div class="media-audio">
          <i class="fa-solid fa-play" style="cursor: pointer; font-size: 16px; color: var(--accent-color);" onclick="this.nextElementSibling.paused ? this.nextElementSibling.play() : this.nextElementSibling.pause()"></i>
          <audio src="${msg.fileUrl}" controls style="display: none;"></audio>
          <div style="height: 4px; background-color: var(--border-color); flex: 1; border-radius: 2px; position: relative;">
            <div style="width: 100%; height: 100%; background-color: var(--accent-color); border-radius: 2px;"></div>
          </div>
          <span style="font-size: 11px;">Voice Note</span>
        </div>
      `;
    } else if (msg.type === 'location') {
      contentHtml = `
        <div class="media-map" onclick="window.open('${msg.mapUrl}', '_blank')">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&auto=format&fit=crop&q=80" class="media-map-img" alt="Shared Location Map">
          <div class="media-map-info">
            <i class="fa-solid fa-location-dot" style="color: #f44336;"></i>
            <div>
              <div style="font-weight: 600;">Shared Location</div>
              <div style="font-size: 10px; opacity: 0.8;">Click to open live coordinates</div>
            </div>
          </div>
        </div>
      `;
    } else if (msg.type === 'sticker') {
      contentHtml = `<img src="${msg.fileUrl}" style="width: 120px; height: 120px; display: block; object-fit: contain; cursor: pointer;">`;
    }

    const isSticker = msg.type === 'sticker';
    row.innerHTML = `
      <div class="message-bubble ${isSticker ? 'sticker-bubble' : ''}">
        ${contentHtml}
        <div class="message-meta">
          <span>${msg.time}</span>
          ${doubleCheck}
        </div>
      </div>
    `;
    messagesFeed.appendChild(row);
  });
  scrollToBottom();
}

// Scroll feed to bottom
function scrollToBottom() {
  messagesFeed.scrollTop = messagesFeed.scrollHeight;
}

// Send user message
function sendMessage() {
  const text = messageInputField.value.trim();
  if (currentChatId === null) return;

  const contact = contacts.find(c => c.id === currentChatId);
  if (!contact) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isRecording) {
    stopRecordingAndSend();
    return;
  }

  if (!text) {
    // If empty text, click behaves as audio recording trigger
    startRecording();
    return;
  }

  // Add text message to local database
  const msgObj = {
    text: text,
    sender: 'sent',
    time: timeStr
  };
  contact.messages.push(msgObj);

  // Publish to MQTT network
  publishMqttMessage(contact, { text: text });

  messageInputField.value = '';
  updateInputIcon();
  renderMessages(contact);
  renderList();
  saveToStorage();
  
  if (contact.id <= 4) {
    triggerAutoReply(contact);
  }
}

// Trigger simulated replies
function triggerAutoReply(contact) {
  setTimeout(() => {
    const replyText = replyResponses[Math.floor(Math.random() * replyResponses.length)];
    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contact.messages.push({
      text: replyText,
      sender: 'received',
      time: replyTime
    });

    if (currentChatId === contact.id) {
      renderMessages(contact);
    } else {
      contact.unreadCount++;
    }
    renderList();
    saveToStorage();
  }, 1500);
}

// Toggle Icon inside Chat Footer based on Input Value
function updateInputIcon() {
  if (messageInputField.value.trim() !== '' || isRecording) {
    sendIcon.className = 'fa-solid fa-paper-plane';
    sendIcon.classList.remove('mic-recording');
  } else {
    sendIcon.className = 'fa-solid fa-microphone';
  }
}

// Media Recorder Functions (Voice Note)
function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Audio recording not supported in this browser.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    localStream = stream;
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      // Encode as Base64 so it can be saved in Local Storage!
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result;
        const contact = contacts.find(c => c.id === currentChatId);
        if (contact && recordedChunks.length > 0) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          contact.messages.push({
            type: 'audio',
            fileUrl: base64Audio,
            sender: 'sent',
            time: timeStr
          });
          publishMqttMessage(contact, { type: 'audio', fileUrl: base64Audio });
          renderMessages(contact);
          renderList();
          saveToStorage();
          if (contact.id <= 4) {
            triggerAutoReply(contact);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    mediaRecorder.start();
    isRecording = true;
    messageInputField.placeholder = "🔴 Recording voice note... Click send to finish";
    messageInputField.disabled = true;
    updateInputIcon();
    sendIcon.className = 'fa-solid fa-paper-plane mic-recording';
  }).catch(err => {
    console.error("Microphone access denied: ", err);
    alert("Please allow microphone access to record voice notes.");
  });
}

// Stop recording and send
function stopRecordingAndSend() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    localStream.getTracks().forEach(track => track.stop());
    isRecording = false;
    messageInputField.disabled = false;
    messageInputField.placeholder = "Type a message";
    updateInputIcon();
  }
}

// Share location (Geolocation API)
function shareLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    const contact = contacts.find(c => c.id === currentChatId);
    if (!contact) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contact.messages.push({
      type: 'location',
      mapUrl: mapUrl,
      sender: 'sent',
      time: timeStr
    });
    publishMqttMessage(contact, { type: 'location', mapUrl: mapUrl });

    renderMessages(contact);
    renderList();
    saveToStorage();
    if (contact.id <= 4) {
      triggerAutoReply(contact);
    }
  }, err => {
    console.warn("Location access denied: ", err);
    // Fallback coordinates (Jakarta coordinates)
    const mapUrl = `https://www.google.com/maps?q=-6.2088,106.8456`;
    const contact = contacts.find(c => c.id === currentChatId);
    if (!contact) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    contact.messages.push({
      type: 'location',
      mapUrl: mapUrl,
      sender: 'sent',
      time: timeStr
    });
    publishMqttMessage(contact, { type: 'location', mapUrl: mapUrl });

    renderMessages(contact);
    renderList();
    saveToStorage();
    if (contact.id <= 4) {
      triggerAutoReply(contact);
    }
  });
}

// File uploads using FileReader
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file || currentChatId === null) return;

  const contact = contacts.find(c => c.id === currentChatId);
  if (!contact) return;

  const reader = new FileReader();
  const fileType = file.type;
  const fileName = file.name;
  const fileSize = (file.size / 1024).toFixed(1) + ' KB';

  reader.onload = function(event) {
    const dataUrl = event.target.result;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (fileType.startsWith('image/')) {
      contact.messages.push({
        type: 'image',
        fileUrl: dataUrl,
        text: fileName,
        sender: 'sent',
        time: timeStr
      });
      publishMqttMessage(contact, { type: 'image', fileUrl: dataUrl, text: fileName });
    } else {
      contact.messages.push({
        type: 'document',
        fileUrl: dataUrl,
        fileName: fileName,
        fileSize: fileSize,
        sender: 'sent',
        time: timeStr
      });
      publishMqttMessage(contact, { type: 'document', fileUrl: dataUrl, fileName: fileName, fileSize: fileSize });
    }

    renderMessages(contact);
    renderList();
    saveToStorage();
    if (contact.id <= 4) {
      triggerAutoReply(contact);
    }
  };

  reader.readAsDataURL(file);
}

// Event Listeners Setup
function setupEventListeners() {
  // Tabs switching
  tabChats.addEventListener('click', () => {
    currentTab = 'chats';
    tabChats.classList.add('active');
    tabStatus.classList.remove('active');
    renderList();
  });

  tabStatus.addEventListener('click', () => {
    currentTab = 'status';
    tabStatus.classList.add('active');
    tabChats.classList.remove('active');
    renderList();
  });

  // Search input change
  searchInput.addEventListener('input', renderList);

  // Send message or start/stop recording on click
  sendMessageBtn.addEventListener('click', sendMessage);

  // Send message on Enter key
  messageInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  messageInputField.addEventListener('input', updateInputIcon);

  // Theme Toggler
  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  });

  // Attachment Dropdown Toggler
  attachBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    attachDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    attachDropdown.classList.add('hidden');
  });

  attachFileOpt.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', handleFileUpload);

  attachLocationOpt.addEventListener('click', shareLocation);

  // Info Sidebar Toggle
  infoToggleBtn.addEventListener('click', () => {
    contactInfoPanel.classList.toggle('hidden');
  });

  closeInfoBtn.addEventListener('click', () => {
    contactInfoPanel.classList.add('hidden');
  });

  // Voice/Video Call Simulators
  callAudioBtn.addEventListener('click', () => startCall('audio'));
  callVideoBtn.addEventListener('click', () => startCall('video'));
  btnCallEnd.addEventListener('click', endCall);

  // Close story
  closeStoryBtn.addEventListener('click', closeStory);

  // Settings Panel Toggles
  myProfileBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('hidden');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
  });

  // Profile picture upload
  profilePicChangeBtn.addEventListener('click', () => {
    profilePicInput.click();
  });

  profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        myProfileBtn.src = dataUrl;
        settingsProfileImg.src = dataUrl;
        saveToStorage();
      };
      reader.readAsDataURL(file);
    }
  });

  // Status picture upload
  statusPicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        myStatusStories.unshift({
          image: dataUrl,
          caption: "My Status Update!",
          time: "Just now"
        });
        renderList();
        saveToStorage();
      };
      reader.readAsDataURL(file);
    }
  });

  // Chat wallpaper presets
  document.querySelectorAll('.bg-preset').forEach(preset => {
    preset.addEventListener('click', () => {
      // Reset borders
      document.querySelectorAll('.bg-preset').forEach(p => {
        p.style.border = '1px solid var(--border-color)';
      });
      preset.style.border = '2px solid var(--accent-color)';

      const color = preset.getAttribute('data-color');
      chatBody.style.backgroundImage = 'none';
      chatBody.style.backgroundColor = color;
      document.documentElement.style.setProperty('--bg-chat-body', color);
      saveToStorage();
    });
  });

  // Custom wallpaper image URL
  applyCustomBgBtn.addEventListener('click', () => {
    const url = customBgUrl.value.trim();
    if (url) {
      chatBody.style.backgroundImage = `url('${url}')`;
      chatBody.style.backgroundSize = 'cover';
      chatBody.style.backgroundPosition = 'center';
      customBgUrl.value = '';
      saveToStorage();
    }
  });

  // New Chat modal event bindings
  newChatBtn.addEventListener('click', () => {
    newContactModal.classList.remove('hidden');
  });

  cancelNewContactBtn.addEventListener('click', () => {
    newContactModal.classList.add('hidden');
    newContactName.value = '';
    newContactPhone.value = '';
  });

  saveNewContactBtn.addEventListener('click', () => {
    const name = newContactName.value.trim();
    const phone = newContactPhone.value.trim();
    if (!name || !phone) {
      alert('Please fill out both Name and Phone number fields.');
      return;
    }

    // Add new contact
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    const newContact = {
      id: newId,
      name: name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', // Default placeholder avatar
      phone: phone,
      statusMessage: "Hey there! I am using Whats Massage.",
      online: Math.random() > 0.5,
      unreadCount: 0,
      messages: [],
      statusStories: []
    };

    contacts.push(newContact);
    saveToStorage();
    renderList();
    
    // Hide modal and clean input
    newContactModal.classList.add('hidden');
    newContactName.value = '';
    newContactPhone.value = '';
    
    // Auto select this new chat
    selectChat(newId);
  });

  // Toggle Picker Panel
  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiStickerPicker.classList.toggle('hidden');
  });

  // Close picker when clicking away
  document.addEventListener('click', () => {
    emojiStickerPicker.classList.add('hidden');
  });

  emojiStickerPicker.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Tab switching inside Picker
  pickerTabEmojis.addEventListener('click', () => {
    pickerTabEmojis.style.color = 'var(--accent-color)';
    pickerTabEmojis.style.borderBottom = '3px solid var(--accent-color)';
    pickerTabStickers.style.color = 'var(--text-secondary)';
    pickerTabStickers.style.borderBottom = 'none';

    pickerEmojisContainer.classList.remove('hidden');
    pickerStickersContainer.classList.add('hidden');
  });

  pickerTabStickers.addEventListener('click', () => {
    pickerTabStickers.style.color = 'var(--accent-color)';
    pickerTabStickers.style.borderBottom = '3px solid var(--accent-color)';
    pickerTabEmojis.style.color = 'var(--text-secondary)';
    pickerTabEmojis.style.borderBottom = 'none';

    pickerStickersContainer.classList.remove('hidden');
    pickerEmojisContainer.classList.add('hidden');
  });

  // Auth Tab Switchers
  authTabSignin.addEventListener('click', () => {
    authTabSignin.style.color = 'var(--accent-color)';
    authTabSignin.style.borderBottom = '3px solid var(--accent-color)';
    authTabSignup.style.color = 'var(--text-secondary)';
    authTabSignup.style.borderBottom = 'none';
    signinForm.classList.remove('hidden');
    signupContainer.classList.add('hidden');
  });

  authTabSignup.addEventListener('click', () => {
    authTabSignup.style.color = 'var(--accent-color)';
    authTabSignup.style.borderBottom = '3px solid var(--accent-color)';
    authTabSignin.style.color = 'var(--text-secondary)';
    authTabSignin.style.borderBottom = 'none';
    signupContainer.classList.remove('hidden');
    signinForm.classList.add('hidden');

    // Reset steps
    signupStepPhone.classList.remove('hidden');
    signupStepOtp.classList.add('hidden');
    signupStepProfile.classList.add('hidden');
  });

  // OTP Verification States
  let generatedOtp = "";
  let pendingPhone = "";

  // Step 1: Click Kirim OTP
  btnSendOtp.addEventListener('click', () => {
    const phoneVal = signupPhone.value.trim();
    if (!phoneVal) {
      alert('Silakan masukkan nomor handphone terlebih dahulu.');
      return;
    }

    pendingPhone = phoneVal;
    // Generate 4-digit code
    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Show simulated SMS banner
    smsBannerMessage.textContent = `Whats Massage: Kode verifikasi Anda adalah ${generatedOtp}. Jangan bagikan kode ini kepada siapapun.`;
    smsBanner.classList.remove('hidden');
    smsBanner.style.top = '20px';

    // Hide banner after 6 seconds
    setTimeout(() => {
      smsBanner.style.top = '-100px';
      setTimeout(() => {
        smsBanner.classList.add('hidden');
      }, 500);
    }, 6000);

    // Go to Step 2
    signupStepPhone.classList.add('hidden');
    signupStepOtp.classList.remove('hidden');
  });

  // Step 2: Click Verifikasi Kode
  btnVerifyOtp.addEventListener('click', () => {
    const otpInputVal = signupOtpInput.value.trim();
    if (otpInputVal === generatedOtp) {
      // Go to Step 3
      signupStepOtp.classList.add('hidden');
      signupStepProfile.classList.remove('hidden');
    } else {
      alert('Kode OTP yang Anda masukkan salah. Silakan coba lagi.');
    }
  });

  // Step 3: Complete registration
  btnFinishSignup.addEventListener('click', () => {
    const nameVal = signupName.value.trim();
    const passwordVal = signupPassword.value;

    if (!nameVal || !passwordVal) {
      alert('Silakan lengkapi nama dan password Anda.');
      return;
    }

    // Save user details
    const userAccount = {
      name: nameVal,
      phone: pendingPhone,
      password: passwordVal
    };

    localStorage.setItem('wm_user_account', JSON.stringify(userAccount));
    localStorage.setItem('wm_logged_in', 'true');

    // Reset fields
    signupPhone.value = '';
    signupOtpInput.value = '';
    signupName.value = '';
    signupPassword.value = '';

    alert('Registrasi akun berhasil!');
    checkAuthSession();
  });

  // Handle Sign In / Login (Phone & Password)
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = signinPhone.value.trim();
    const password = signinPassword.value;

    const storedUser = JSON.parse(localStorage.getItem('wm_user_account'));
    if (storedUser && storedUser.phone === phone && storedUser.password === password) {
      localStorage.setItem('wm_logged_in', 'true');
      signinPhone.value = '';
      signinPassword.value = '';
      checkAuthSession();
    } else {
      alert('Nomor handphone atau password salah.');
    }
  });

  // Log Out button action
  logoutBtn.addEventListener('click', () => {
    localStorage.setItem('wm_logged_in', 'false');
    settingsPanel.classList.add('hidden');
    checkAuthSession();
  });

  // Group creation modal triggers
  openGroupModalBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden'); // hide settings
    groupCreateModal.classList.remove('hidden');

    // Populate contacts checkboxes
    groupContactsList.innerHTML = '';
    // Show only real personal contacts, not group chats
    const personalContacts = contacts.filter(c => c.type !== 'group');
    if (personalContacts.length === 0) {
      groupContactsList.innerHTML = '<div style="color: var(--text-secondary); font-size: 13px;">No contacts to add</div>';
      return;
    }

    personalContacts.forEach(c => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '10px';
      row.style.padding = '4px 0';
      row.innerHTML = `
        <input type="checkbox" class="group-member-checkbox" value="${c.id}" id="chk-${c.id}">
        <img src="${c.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
        <label for="chk-${c.id}" style="color: var(--text-primary); font-size: 14px; cursor: pointer; flex: 1;">${c.name}</label>
      `;
      groupContactsList.appendChild(row);
    });
  });

  cancelGroupBtn.addEventListener('click', () => {
    groupCreateModal.classList.add('hidden');
    newGroupName.value = '';
  });

  saveGroupBtn.addEventListener('click', () => {
    const name = newGroupName.value.trim();
    if (!name) {
      alert('Please enter a Group Name.');
      return;
    }

    const checkboxes = document.querySelectorAll('.group-member-checkbox:checked');
    if (checkboxes.length === 0) {
      alert('Please select at least one participant.');
      return;
    }

    const memberIds = Array.from(checkboxes).map(chk => parseInt(chk.value));
    
    // Create new group contact
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    const newGroup = {
      id: newId,
      name: name,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80', // Group avatar placeholder
      phone: `Group (${checkboxes.length} participants)`,
      statusMessage: "Whats Massage Group Chat",
      online: true,
      unreadCount: 0,
      messages: [
        { sender: 'received', text: `Welcome to "${name}" group chat!`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      statusStories: [],
      type: 'group',
      members: memberIds
    };

    contacts.push(newGroup);
    saveToStorage();
    renderList();

    groupCreateModal.classList.add('hidden');
    newGroupName.value = '';

    // Auto-select group
    selectChat(newId);
  });

  // Mute Contact Action
  infoMuteBtn.addEventListener('click', () => {
    const contact = contacts.find(c => c.id === currentChatId);
    if (!contact) return;

    contact.muted = !contact.muted;
    saveToStorage();
    infoMuteLabel.textContent = contact.muted ? 'Unmute Notifications' : 'Mute Notifications';
    renderList();
  });

  // Clear Chat Messages Action
  infoClearBtn.addEventListener('click', () => {
    const contact = contacts.find(c => c.id === currentChatId);
    if (!contact) return;

    if (confirm(`Are you sure you want to clear all messages with ${contact.name}?`)) {
      contact.messages = [];
      saveToStorage();
      renderMessages(contact);
      renderList();
    }
  });

  // Delete Chat Contact Action
  infoDeleteBtn.addEventListener('click', () => {
    const contact = contacts.find(c => c.id === currentChatId);
    if (!contact) return;

    if (confirm(`Are you sure you want to delete the chat with ${contact.name}?`)) {
      contacts = contacts.filter(c => c.id !== currentChatId);
      saveToStorage();
      
      // Reset view to empty state
      currentChatId = null;
      chatActiveContainer.classList.add('hidden');
      chatEmptyState.classList.remove('hidden');
      contactInfoPanel.classList.add('hidden');
      renderList();
    }
  });

  // Copy Invite Link Action
  copyInviteLinkBtn.addEventListener('click', () => {
    const userAccount = JSON.parse(localStorage.getItem('wm_user_account'));
    if (!userAccount) {
      alert('Please register first to generate your custom invite link!');
      return;
    }

    const currentUrl = window.location.href.split('?')[0];
    const inviteUrl = `${currentUrl}?invite_phone=${encodeURIComponent(userAccount.phone)}&invite_name=${encodeURIComponent(userAccount.name)}`;

    navigator.clipboard.writeText(inviteUrl).then(() => {
      alert('Link undang berhasil disalin ke clipboard! Kirimkan link ini ke teman Anda.');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert(`Gagal menyalin link secara otomatis. Silakan salin link berikut secara manual:\n\n${inviteUrl}`);
    });
  });
}

// Active Calling Simulator with WebRTC Camera Streaming
let callStatusTimer = null;
function startCall(type) {
  const contact = contacts.find(c => c.id === currentChatId);
  if (!contact) return;

  callAvatar.src = contact.avatar;
  callName.textContent = contact.name;
  callOverlay.classList.remove('hidden');
  
  if (type === 'video') {
    callTypeIcon.innerHTML = `<i class="fa-solid fa-video"></i>`;
    callStatusLabel.textContent = "Requesting video access...";
    videoStreamContainer.classList.remove('hidden');

    // Access real webcam stream for call overlay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        callStatusLabel.textContent = "Connecting...";

        callStatusTimer = setTimeout(() => {
          callStatusLabel.textContent = "Connected (Live)";
          callStatusLabel.style.color = "#00e676";
        }, 1500);
      }).catch(err => {
        console.warn("Camera access denied: ", err);
        callStatusLabel.textContent = "Connecting (Voice only)...";
        videoStreamContainer.classList.add('hidden');
        callStatusTimer = setTimeout(() => {
          callStatusLabel.textContent = "Connected (No camera)";
          callStatusLabel.style.color = "#00e676";
        }, 1500);
      });
    }
  } else {
    callTypeIcon.innerHTML = `<i class="fa-solid fa-phone"></i>`;
    callStatusLabel.textContent = "Calling...";
    videoStreamContainer.classList.add('hidden');

    // Request microphone access only
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        localStream = stream;
        callStatusTimer = setTimeout(() => {
          callStatusLabel.textContent = "Connected";
          callStatusLabel.style.color = "#00e676";
        }, 1500);
      }).catch(err => {
        console.warn("Microphone access denied: ", err);
        callStatusTimer = setTimeout(() => {
          callStatusLabel.textContent = "Connected";
          callStatusLabel.style.color = "#00e676";
        }, 1500);
      });
    }
  }
}

function endCall() {
  clearTimeout(callStatusTimer);
  callOverlay.classList.add('hidden');
  callStatusLabel.style.color = "";
  
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  localVideo.srcObject = null;
}

// Story view simulation
let storyTimer = null;
function openStory(contact) {
  const story = contact.statusStories[0];
  if (!story) return;

  storyUserAvatar.src = contact.avatar;
  storyUserName.textContent = contact.name;
  storyTime.textContent = story.time;
  storyContentImage.src = story.image;
  storyCaptionText.textContent = story.caption;

  storyProgressContainer.innerHTML = `<div class="story-progress-segment"><div class="story-progress-fill" id="story-progress-fill"></div></div>`;
  storyOverlay.classList.remove('hidden');

  // Trigger animation next tick
  setTimeout(() => {
    const fill = document.getElementById('story-progress-fill');
    if (fill) fill.style.width = '100%';
  }, 50);

  // Auto close story after 5s
  storyTimer = setTimeout(() => {
    closeStory();
  }, 5000);
}

function closeStory() {
  clearTimeout(storyTimer);
  storyOverlay.classList.add('hidden');
}

// Populate Emojis & Stickers Picker Elements
function populatePicker() {
  // Populate Emojis
  pickerEmojisContainer.innerHTML = '';
  EMOJIS.forEach(emoji => {
    const span = document.createElement('span');
    span.className = 'picker-item';
    span.textContent = emoji;
    span.style.cursor = 'pointer';
    span.onclick = () => {
      messageInputField.value += emoji;
      updateInputIcon();
    };
    pickerEmojisContainer.appendChild(span);
  });

  // Populate Stickers
  pickerStickersContainer.innerHTML = '';
  STICKERS.forEach(stickerUrl => {
    const img = document.createElement('img');
    img.className = 'picker-item';
    img.src = stickerUrl;
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.objectFit = 'contain';
    img.style.cursor = 'pointer';
    img.onclick = () => {
      sendSticker(stickerUrl);
    };
    pickerStickersContainer.appendChild(img);
  });
}

// Send Sticker message
function sendSticker(url) {
  const contact = contacts.find(c => c.id === currentChatId);
  if (!contact) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  contact.messages.push({
    type: 'sticker',
    fileUrl: url,
    sender: 'sent',
    time: timeStr
  });
  publishMqttMessage(contact, { type: 'sticker', fileUrl: url });

  renderMessages(contact);
  renderList();
  saveToStorage();
  emojiStickerPicker.classList.add('hidden'); // Close picker
  if (contact.id <= 4) {
    triggerAutoReply(contact);
  }
}

// Connect to Public MQTT Broker for Real-time Messaging
function connectMqtt(myPhone) {
  if (mqttClient) {
    mqttClient.end();
  }

  // Clean phone number to make a valid topic name (alphanumeric only)
  const cleanPhone = myPhone.replace(/[^a-zA-Z0-9]/g, "");
  
  // Connect to the public HiveMQ broker over Secure WebSockets
  mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

  mqttClient.on('connect', () => {
    console.log('Connected to Whats Massage Real-time network!');
    // Subscribe to personal messages
    mqttClient.subscribe(`whats_massage/user/${cleanPhone}`, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: whats_massage/user/${cleanPhone}`);
      }
    });

    // Subscribe to all group chats I am in
    contacts.forEach(c => {
      if (c.type === 'group') {
        mqttClient.subscribe(`whats_massage/group/${c.id}`);
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      
      if (topic.startsWith('whats_massage/group/')) {
        // Handle group message
        const groupId = parseInt(topic.split('/').pop());
        const myUser = JSON.parse(localStorage.getItem('wm_user_account'));
        if (myUser && payload.senderPhone !== myUser.phone) {
          handleIncomingGroupMessage(groupId, payload);
        }
      } else {
        // Handle direct message
        handleIncomingMqttMessage(payload);
      }
    } catch (e) {
      console.warn("Failed to parse incoming real-time message:", e);
    }
  });
}

// Publish MQTT payload to network
function publishMqttMessage(contact, msg) {
  if (!mqttClient || !mqttClient.connected) return;

  const myUser = JSON.parse(localStorage.getItem('wm_user_account'));
  if (!myUser) return;

  const payload = {
    senderPhone: myUser.phone,
    senderName: myUser.name,
    ...msg,
    time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (contact.type === 'group') {
    mqttClient.publish(`whats_massage/group/${contact.id}`, JSON.stringify(payload));
  } else {
    const cleanRecipientPhone = contact.phone.replace(/[^a-zA-Z0-9]/g, "");
    mqttClient.publish(`whats_massage/user/${cleanRecipientPhone}`, JSON.stringify(payload));
  }
}

// Handle Incoming Direct Messages
function handleIncomingMqttMessage(payload) {
  const phone = payload.senderPhone;
  const name = payload.senderName;

  let contact = contacts.find(c => c.phone === phone);
  if (!contact) {
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    contact = {
      id: newId,
      name: name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      phone: phone,
      statusMessage: "Hey there! I am using Whats Massage.",
      online: true,
      unreadCount: 0,
      messages: [],
      statusStories: []
    };
    contacts.push(contact);
  }

  contact.messages.push({
    text: payload.text,
    sender: 'received',
    time: payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: payload.type,
    fileUrl: payload.fileUrl,
    fileName: payload.fileName,
    fileSize: payload.fileSize,
    mapUrl: payload.mapUrl
  });

  if (currentChatId !== contact.id) {
    contact.unreadCount++;
  } else {
    renderMessages(contact);
  }

  renderList();
  saveToStorage();
  playNotificationSound();
}

// Handle Incoming Group Messages
function handleIncomingGroupMessage(groupId, payload) {
  let groupContact = contacts.find(c => c.id === groupId);
  if (!groupContact) return;

  groupContact.messages.push({
    text: `[${payload.senderName}]: ${payload.text || ""}`,
    sender: 'received',
    time: payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: payload.type,
    fileUrl: payload.fileUrl,
    fileName: payload.fileName,
    fileSize: payload.fileSize,
    mapUrl: payload.mapUrl
  });

  if (currentChatId !== groupContact.id) {
    groupContact.unreadCount++;
  } else {
    renderMessages(groupContact);
  }

  renderList();
  saveToStorage();
  playNotificationSound();
}

function playNotificationSound() {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav');
    audio.play();
  } catch (err) {
    console.log("Audio play blocked by browser.");
  }
}

// Handle pending invite parameter on successful login/registration
function handlePendingInvite() {
  if (!pendingInvite) return;

  let contact = contacts.find(c => c.phone === pendingInvite.phone);
  if (!contact) {
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    contact = {
      id: newId,
      name: pendingInvite.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      phone: pendingInvite.phone,
      statusMessage: "Hey! Let's chat on Whats Massage.",
      online: true,
      unreadCount: 0,
      messages: [
        { text: "Hai! Saya terhubung melalui Link Undang Whats Massage.", sender: "received", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      statusStories: []
    };
    contacts.push(contact);
    saveToStorage();
    renderList();
  }

  selectChat(contact.id);
  window.history.replaceState({}, document.title, window.location.pathname);
  pendingInvite = null;
}

// Run application
init();
