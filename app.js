/* ==========================================
   IDEASJENERATION Landing Page Logic
   Vanilla JavaScript with Smooth Transitions
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navigation Bar Styling on Scroll
  const header = document.getElementById('mainHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled

  // 2. Active Nav Link on Scroll Spy
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.classList.add('active');
      }
    });
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('open');
    
    // Simple inline slide transition for mobile
    if (navLinks.classList.contains('active')) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(13, 17, 26, 0.95)';
      navLinks.style.backdropFilter = 'blur(16px)';
      navLinks.style.padding = '2rem';
      navLinks.style.borderBottom = '1px solid var(--glass-border)';
      navLinks.style.gap = '1.5rem';
    } else {
      navLinks.style.display = '';
    }
  });

  // Close mobile nav when clicking a link
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('open');
        navLinks.style.display = '';
      }
    });
  });

  // 4. Modal Interactions
  window.openModal = (serviceType) => {
    const modalId = serviceType === 'consulting' ? 'consultingModal' : 'miningModal';
    const modal = document.getElementById(modalId);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
  };

  window.closeModal = (serviceType) => {
    const modalId = serviceType === 'consulting' ? 'consultingModal' : 'miningModal';
    const modal = document.getElementById(modalId);
    
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  };

  // Close modals when clicking outside container
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 5. Contact Form Subject Preset & Navigation
  window.setContactSubject = (subject) => {
    // 1. Close all open modals first
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';

    // 2. Select corresponding value in dropdown
    const selectEl = document.getElementById('interestService');
    
    // Find matching option
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === subject || selectEl.options[i].text.includes(subject)) {
        selectEl.selectedIndex = i;
        break;
      }
    }

    // 3. Smooth scroll to form
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Focus the message box to guide user action
    setTimeout(() => {
      document.getElementById('clientMessage').focus();
    }, 800);
  };



  // 7. Contact Form Handling & Micro-Animations
  const consultationForm = document.getElementById('consultationForm');
  const formSuccess = document.getElementById('formSuccessMessage');
  const submitBtn = consultationForm.querySelector('button[type="submit"]');

  consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Loading State Animation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = `
      <span>Processing Request...</span>
      <svg class="btn-icon" style="animation: spin 1s linear infinite" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
      </svg>
    `;

    // Add inline rotating keyframes for spinner if not present
    if (!document.getElementById('spinAnimation')) {
      const style = document.createElement('style');
      style.id = 'spinAnimation';
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }

    // Submit using fetch to Formspree
    const data = new FormData(consultationForm);
    
    fetch(consultationForm.action, {
      method: consultationForm.method || 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      // Restore Button State
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalText;

      if (response.ok) {
        // Show success alert
        formSuccess.style.display = 'flex';
        
        // Reset Form fields
        consultationForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.style.opacity = '0';
          setTimeout(() => {
            formSuccess.style.display = 'none';
            formSuccess.style.opacity = '1';
          }, 400);
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      // Restore Button State
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalText;
      alert('Oops! There was a problem submitting your form. Please try again or email us directly.');
    });
  });

});

// Global tab switcher for Training 6 Pillars
window.switchTrainingTab = function(pillarIndex) {
  // Update tab buttons active classes
  const tabs = document.querySelectorAll('.training-tab');
  tabs.forEach((tab, idx) => {
    if (idx + 1 === pillarIndex) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update content panels active classes
  const panels = document.querySelectorAll('.training-pillar-panel');
  panels.forEach(panel => {
    const panelId = parseInt(panel.id.replace('pillar-', ''));
    if (panelId === pillarIndex) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
};

// Global course interest selection helper
window.setContactCourse = function(courseName) {
  // 1. Close all open modals first
  const activeModals = document.querySelectorAll('.modal-overlay.active');
  activeModals.forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';

  // 2. Select corresponding value in dropdown
  const selectEl = document.getElementById('interestService');
  
  let targetOption = "";
  const lowerName = courseName.toLowerCase();
  
  if (lowerName.includes('strategic marketing') || lowerName.includes('branding & positioning') || lowerName.includes('marketing strategy 101') || lowerName.includes('brand growth')) {
    targetOption = "Training : Marketing & Brand Growth Strategy";
  } else if (lowerName.includes('data-driven') || lowerName.includes('consumer insight') || lowerName.includes('data mining')) {
    targetOption = "Training : Consumer Insight, Data Mining & Market Intelligence";
  } else if (lowerName.includes('boss') || lowerName.includes('tiktok') || lowerName.includes('gen z style')) {
    targetOption = "Training : Digital, TikTok & Modern Consumer Marketing";
  } else if (lowerName.includes('innovation') || lowerName.includes('creative thinking')) {
    targetOption = "Training : Innovation & Product Concept Development";
  } else if (lowerName.includes('risk') || lowerName.includes('finance')) {
    targetOption = "Training : Business Strategy, Finance & Risk Thinking";
  } else if (lowerName.includes('cmo') || lowerName.includes('leadership') || lowerName.includes('in-house')) {
    targetOption = "Training : Customized Corporate Training & Capability Building";
  }
  
  if (targetOption) {
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === targetOption) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }

  // 3. Set the message box value
  const messageBox = document.getElementById('clientMessage');
  messageBox.value = `I am interested in this course: ${courseName}`;

  // 4. Smooth scroll to form
  const contactSection = document.getElementById('contact');
  contactSection.scrollIntoView({ behavior: 'smooth' });

  // Focus the message box to guide user action
  setTimeout(() => {
    messageBox.focus();
  }, 800);
};
