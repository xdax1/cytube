window.INITCHATMAXSIZE = /*window.CHATMAXSIZE || */100;

$("#messagebuffer").unbind('scroll');
$("#messagebuffer").scroll(function (ev) {
    if (IGNORE_SCROLL_EVENT) {
        IGNORE_SCROLL_EVENT = false;
        return;
    }

    var m = $("#messagebuffer");
    var lastChildHeight = 0;
    var messages = m.children();
    if (messages.length > 0) {
        lastChildHeight = $(messages[messages.length - 1]).outerHeight() || 0;
    }

    var isCaughtUp = m.height() + m.scrollTop() >= m.prop("scrollHeight") - lastChildHeight;
    if (isCaughtUp) {
        SCROLLCHAT = true;
        window.CHATMAXSIZE = window.INITCHATMAXSIZE || 100;
        $("#newmessages-indicator").remove();
    } else {
        SCROLLCHAT = false;
    }
});

function addChatMessage(data) {
    if(IGNORED.indexOf(data.username) !== -1) {
        return;
    }
    if (data.meta.shadow && !USEROPTS.show_shadowchat) {
        return;
    }
    if (data.time < LASTCHAT.time) {
        return;
    } else {
        LASTCHAT.time = data.time;
    }

    var msgBuf = $("#messagebuffer");
    var div = formatChatMessage(data, LASTCHAT);
    var safeUsername = data.username.replace(/[^\w-]/g, '\\$');
    div.addClass("chat-msg-" + safeUsername);
    div.appendTo(msgBuf);
    div.on('mouseover', function() {
        $(".chat-msg-" + safeUsername).addClass("nick-hover");
    });
    div.on('mouseleave', function() {
        $(".nick-hover").removeClass("nick-hover");
    });
    var oldHeight = msgBuf.prop("scrollHeight");
    //var numRemoved = trimChatBuffer();
    if (SCROLLCHAT) {
        scrollChat();
        trimChatBuffer();
    } else {
        if (window.CHATMAXSIZE < 5000) { ++window.CHATMAXSIZE; }
        var newMessageDiv = $("#newmessages-indicator");
        if (!newMessageDiv.length) {
            newMessageDiv = $("<div/>").attr("id", "newmessages-indicator")
                    .insertBefore($("#chatline"));
            var bgHack = $("<span/>").attr("id", "newmessages-indicator-bghack")
                    .appendTo(newMessageDiv);

            $("<span/>").addClass("glyphicon glyphicon-chevron-down")
                    .appendTo(bgHack);
            $("<span/>").text("New Messages Below").appendTo(bgHack);
            $("<span/>").addClass("glyphicon glyphicon-chevron-down")
                    .appendTo(bgHack);
            newMessageDiv.on('click', function () {
                SCROLLCHAT = true;
                scrollChat();
                trimChatBuffer();
            });
        }

        /*if (numRemoved > 0) {
            IGNORE_SCROLL_EVENT = true;
            var diff = oldHeight - msgBuf.prop("scrollHeight");
            scrollAndIgnoreEvent(msgBuf.scrollTop() - diff);
        }*/
    }

    div.find("img").load(function () {
        if (SCROLLCHAT) {
            scrollChat();
            trimChatBuffer();
        }
    });

    var isHighlight = false;
    if (CLIENT.name && data.username != CLIENT.name) {
        if (highlightsMe(data.msg)) {
            div.addClass("nick-highlight");
            isHighlight = true;
        }
    }

    pingMessage(isHighlight, data.username, $(div.children()[2]).text());
}
