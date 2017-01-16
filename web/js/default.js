AppLauncher = (function() {

  const nodeJSStuff = (function() {
    try {
      var electronMainProcess = require("electron").remote.process;
      var settings = require("electron-settings").getSync("");
      if (settings.hideCursor) {
        // hide the cursor if necessary
        var lastCSS = document.styleSheets[document.styleSheets.length - 1];
        lastCSS.insertRule("* { cursor: none; }", lastCSS.cssRules.length);
      }
      return {
        stdout: electronMainProcess.stdout,
        stderr: electronMainProcess.stderr,
        childProcess: require("child_process"),
        settings: settings
      };
    } catch(err) {
      return undefined;
    }
  })();

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
    if(!(typeof nodeJSStuff === 'undefined')) {
      const command = nodeJSStuff.settings.apps[appID];
      console.log(appID + ": " + command + " (shell: " + nodeJSStuff.settings.shell + ")");
      const appProcess = nodeJSStuff.childProcess.spawn(command, [], {stdio: [ 'ignore', nodeJSStuff.stdout, nodeJSStuff.stderr ], shell: nodeJSStuff.settings.shell} );
      appProcess.on('exit', exitApp);
    } else {
      // dummy if you are using this without nodejs/electron
      setTimeout(exitApp, 3000);
    }
  }

  function exitApp() {
    $('body').removeClass('app-open');
    $('.app-button.selected').removeClass('selected');
    unmaskEvents();
  }

  function init() {
    // Disable dragging
    $('body').on('dragstart', function() {
      return false;
    });

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