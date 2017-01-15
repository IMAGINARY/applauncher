AppLauncher = (function() {

  function maskEvents() {
    $('body').css({
      pointerEvents: 'none'
    });
  }

  function unmaskEvents() {
    $('body').css({
      pointerEvents: 'initial'
    });
  }

  function openInfoPane(id) {
    $('.info-pane-visible').removeClass('info-pane-visible');
    $('body').addClass('info-open');
    $('[data-info-pane=' + id + ']').addClass('info-pane-visible');
  }

  function closeInfoPane() {
    $('body').removeClass('info-open');
    $('.info-pane-visible').removeClass('info-pane-visible');
  }

  function createLaunchAnimation(appButton) {
    var $screenshot = $(appButton).find('.screenshot');

    var $exploder = $('<img class="launchExploder" />');
    $exploder.attr('src', $screenshot.attr('src'));
    $('body').append($exploder);
    $exploder.css({
      width: $screenshot.width(),
      height: $screenshot.height(),
      top: $screenshot.offset().top,
      left: $screenshot.offset().left
    });

    setTimeout(function() {
      $exploder.addClass('animate');
    }, 0);
    setTimeout(function() {
      $exploder.remove();
    }, 1000);
  }

  function launchApp(appButton) {
    maskEvents();
    closeInfoPane();
    var appID = $(appButton).attr('data-launch-app');
    $(appButton).addClass('selected');
    createLaunchAnimation(appButton);
    $('body').addClass('app-open');
    // TODO: Launch the app here (appID holds the name). Remove the timer. Call exitApp() on then().
    setTimeout(function() {
      exitApp();
    }, 3000);
  }

  function exitApp() {
    $('body').removeClass('app-open');
    $('.app-button.selected').removeClass('selected');
    unmaskEvents();
  }

  function init() {
    // Init app launching buttons
    $('[data-launch-app]').on('click', function() {
      launchApp(this);
      return false;
    });

    // Init util buttons
    $('[data-open-info-pane]').on('click', function(){
      openInfoPane($(this).attr('data-open-info-pane'));
      return false;
    });

    $('[data-close-info-pane]').on('click', function(){
      closeInfoPane();
      return false;
    });
  };

  $(init);

  return {
    openInfoPane: openInfoPane,
    closeInfoPane: closeInfoPane
  };
})();