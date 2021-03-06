function init() {
    if (localStorage.showdemo != 0) {
        window.onload = function () {
            coords = {
                Background: {
                    Image: {
                        ImageIndex: 265,
                        X: 0,
                        Y: 0
                    }
                },
                Time: {
                    Hours: {
                        Ones: {
                            ImageIndex: 255,
                            ImagesCount: 10,
                            X: 87,
                            Y: 26
                        },
                        Tens: {
                            ImageIndex: 255,
                            ImagesCount: 10,
                            X: 37,
                            Y: 26
                        }
                    },
                    Minutes: {
                        Ones: {
                            ImageIndex: 255,
                            ImagesCount: 10,
                            X: 112,
                            Y: 77
                        },
                        Tens: {
                            ImageIndex: 255,
                            ImagesCount: 10,
                            X: 62,
                            Y: 77
                        }
                    }
                }
            }
            setTimeout(view.makeWf, 350);
            load.disableBtn(1);
        }
        if (!('showdemo' in localStorage))
            localStorage.showdemo = 1;
    } else
        $("showdemocheck").checked = false;
    $("showdemocheck").onchange = function () {
        localStorage.showdemo = $("showdemocheck").checked ? 1 : 0;
        location.reload();
    }
    for (var i = 200; i <= 292; i++)
        $("defimages").innerHTML += '<img src="defaultimages/' + i + '.png" id="' + i + '">';
    if (!('helpShown' in localStorage)) {
        UIkit.modal($("modal-howto")).show();
        localStorage.helpShown = true;
    }

    function addScript(url) {
        var e = document.createElement("script");
        e.src = url;
        e.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }
    data.app.edgeBrowser = navigator.userAgent.search(/Edge/) > 0 || navigator.userAgent.search(/Firefox/) > 0 ? true : false;
    if (data.app.edgeBrowser) {
        UIkit.notification("Something may not work in your browser. WebKit-based browser recommended", {
            status: 'warning',
            pos: 'top-left',
            timeout: 7500
        });
        addScript("js/FileSaver.min.js");
        addScript("js/canvas-toBlob.js");
    }
    $('inputimages').onchange = function () {
        if (this.files.length) {
            var i = 0;
            console.log("Images count: ", this.files.length);
            while (i < this.files.length) {
                load.renderImage(this.files[i]);
                i++;
            }
            data.imagesset = true;
            if ($('inputimages').nextElementSibling.classList.contains("uk-button-danger"))
                $('inputimages').nextElementSibling.classList.remove("uk-button-danger");
            $('inputimages').nextElementSibling.classList.add("uk-label-success");
        }
        if (data.imagesset && data.jsset)
            load.disableBtn(1);
        else
            load.disableBtn(0);
    }
    $('inputjs').onchange = function () {
        if (this.files.length) {
            data.wfname = this.files[0].name.split(".")[0];
            console.log("Watchface name: ", data.wfname);
            document.title = "Watchface edit " + data.wfname;
            var reader = new FileReader();
            reader.onload = function (e) {
                try {
                    coords = jsonlint.parse(e.target.result);
                } catch (error) {
                    $("jsonerrortext").innerHTML = error;

                    function show() {
                        UIkit.modal($("jsonerrormodal")).show()
                    }
                    setTimeout(show, 200);
                    console.warn(error);
                }
            }
            reader.readAsText(this.files[0]);
            delete reader;
            data.jsset = true;
            if ($('inputjs').nextElementSibling.classList.contains("uk-button-danger"))
                $('inputjs').nextElementSibling.classList.remove("uk-button-danger");
            $('inputjs').nextElementSibling.classList.add("uk-label-success");
        }
        if (data.imagesset && data.jsset)
            load.disableBtn(1);
        else
            load.disableBtn(0);
    }

    if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < data.app.imagestabversion)
        $("imagesbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    if (!('editortabversion' in localStorage) || localStorage.editortabversion < data.app.editortabversion)
        $("codeopenbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';
    if (!('designtabversion' in localStorage) || localStorage.designtabversion < data.app.designtabversion)
        $("editbutton").lastChild.innerHTML += ' <span class="uk-badge indevbadge">New</span>';

}

function $(el) {
    return document.getElementById(el);
}

function $c(el) {
    return document.getElementById(el).cloneNode(false);
}

function div(a, b) {
    return (a - a % b) / b;
}

function removeByClass(cl) {
    var els = document.getElementsByClassName(cl);
    for (var i = 0; els.length; i++)
        $("watchface").removeChild(els[0]);
}

var coords = 0,
    data = {
        app: {
            imagestabversion: 2,
            editortabversion: 1,
            designtabversion: 1,
            edgeBrowser: undefined
        },
        timeOnClock: ["20", "38"],
        seconds: [4, 3],
        analog: [259, 228, 60],
        weekDay: 2,
        day: 6,
        month: 12,
        batteryT: 20,
        calories: 860,
        steps: 5687,
        stepsgoal: 12000,
        distance: [5, 67],
        pulse: 72,
        temp: [22, 24],
        weathericon: 0,
        alarm: true,
        bluetooth: true,
        dnd: true,
        lock: true,
        local: (location.protocol != "file:" ? false : true),
        firstopen_editor: ('firstopen_editor' in sessionStorage ? false : true),
        firstopen_constr: ('firstopen_constr' in sessionStorage ? false : true),
        jsset: false,
        imagesset: false,
        wfname: "watchface"
    },
    view = {
        drawAnalog: function (el, value) {
            var col = el.Color.replace("0x", "#"),
                d = "M " + el.Shape[0].X + " " + el.Shape[0].Y,
                iters = el.Shape.length,
                fill = el.OnlyBorder ? "none" : col;
            for (var i = 0; i < iters; i++) {
                d += "L " + el.Shape[i].X + " " + el.Shape[i].Y + " ";
            }
            d += "L " + el.Shape[0].X + " " + el.Shape[0].Y + " ";
            $('svg-cont-clock').innerHTML += '<path d="' + d + '" transform="rotate(' + (value - 90) + ' ' + el.Center.X + ' ' + el.Center.Y + ') translate(' + el.Center.X + " " + el.Center.Y + ') " fill="' + fill + '" stroke="' + col + '"></path>';
            if ('CenterImage' in el) {
                view.setPosN(el.CenterImage, 0, "c_an_img");
            }
        },
        setTextPos: function (el, value, cls) {
            var t = view.makeBlock(el, value);
            view.renderBlock(t.block, t.width, el, cls);
        },
        insert: function (t, name) {
            t.removeAttribute('id');
            t.classList.add(name);
            $("watchface").appendChild(t);
        },
        setPosN: function (el, value, cls) {
            t = $c(el.ImageIndex + value);
            t.style.left = el.X + "px";
            t.style.top = el.Y + "px";
            view.insert(t, cls);
        },
        setPos: function (t, el) {
            t.style.left = el.X + "px";
            t.style.top = el.Y + "px";
        },
        makeWf: function () {
            try {
                $("watchface").innerHTML = '';
                $("svg-cont-clock").innerHTML = '';
                $("svg-cont-steps").innerHTML = '';
                UIkit.notification.closeAll()
                var t = 0;
                if ('Background' in coords)
                    view.setPosN(coords.Background.Image, 0, "c_bg");
                if ('Time' in coords) {
                    if ('Seconds' in coords.Time)
                        draw.time.seconds();
                    draw.time.time();
                }
                if ('Date' in coords) {
                    if ('WeekDay' in coords.Date)
                        draw.date.weekday();
                    if ('MonthAndDay' in coords.Date) {
                        if ('Separate' in coords.Date.MonthAndDay) {
                            if ('Day' in coords.Date.MonthAndDay.Separate)
                                draw.date.sepday();
                            if ('Month' in coords.Date.MonthAndDay.Separate)
                                draw.date.sepmonth();
                        }
                        if ('OneLine' in coords.Date.MonthAndDay)
                            draw.date.oneline();
                    }
                }
                if ('Battery' in coords) {
                    if ('Icon' in coords.Battery)
                        draw.battery.icon();
                    if ('Text' in coords.Battery)
                        draw.battery.text();
                    if ('Scale' in coords.Battery)
                        draw.battery.scale();
                }

                if ('Status' in coords) {
                    if ('Alarm' in coords.Status)
                        draw.status.alarm();
                    if ('Bluetooth' in coords.Status)
                        draw.status.bt();
                    if ('DoNotDisturb' in coords.Status)
                        draw.status.dnd();
                    if ('Lock' in coords.Status)
                        draw.status.lock();
                }
                if ('Activity' in coords) {
                    if ('Calories' in coords.Activity)
                        draw.activity.cal();
                    if ('Steps' in coords.Activity)
                        draw.activity.steps();
                    if ('StepsGoal' in coords.Activity)
                        draw.activity.stepsgoal();
                    if ('Pulse' in coords.Activity)
                        draw.activity.pulse();
                    if ('Distance' in coords.Activity)
                        draw.activity.distance();
                }
                if ('Weather' in coords) {
                    if ('Icon' in coords.Weather)
                        draw.weather.icon();
                    if ('Temperature' in coords.Weather) {
                        if ('Today' in coords.Weather.Temperature) {
                            if ('OneLine' in coords.Weather.Temperature.Today)
                                draw.weather.temp.oneline();
                            if ('Separate' in coords.Weather.Temperature.Today) {
                                if ('Day' in coords.Weather.Temperature.Today.Separate)
                                    draw.weather.temp.sep.day();
                                if ('Night' in coords.Weather.Temperature.Today.Separate)
                                    draw.weather.temp.sep.night();
                            }
                        }
                        if ('Current' in coords.Weather.Temperature)
                            draw.weather.temp.current();
                    }
                    if ('AirPollution' in coords.Weather)
                        draw.weather.air();
                }
                if ('StepsProgress' in coords) {
                    if ('Circle' in coords.StepsProgress)
                        draw.stepsprogress.circle();
                    if ('Linear' in coords.StepsProgress)
                        draw.stepsprogress.linear();
                    if ('GoalImage' in coords.StepsProgress && data.steps >= data.stepsgoal)
                        draw.stepsprogress.goal();
                }
                if ('AnalogDialFace' in coords) {
                    if ('Hours' in coords.AnalogDialFace)
                        draw.analog.hours();
                    if ('Minutes' in coords.AnalogDialFace)
                        draw.analog.minutes();
                    if ('Seconds' in coords.AnalogDialFace)
                        draw.analog.seconds();
                }
            } catch (error) {
                console.warn(error);
                if (error.name == "TypeError") {
                    UIkit.notification("Image for prorety not found", {
                        status: 'danger',
                        pos: 'top-left',
                        timeout: 7500
                    });
                }
            }
        },
        renderBlock: function (block, width, el, cls) {
            var t, offset = 0;
            if (el.Alignment == 18 || el.Alignment == "TopLeft") {
                block.reverse();
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 20 || el.Alignment == "TopRight") {
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 34 || el.Alignment == "BottomLeft") {
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.BottomRightX - t.width + 1 - offset + "px";
                    t.style.top = el.BottomRightY - t.height + 1 + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 24 || el.Alignment == "TopCenter") {
                block.reverse();
                offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                //console.log(offset);
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else if (el.Alignment == 72 || el.Alignment == "Center") {
                block.reverse();
                offset = div(((el.BottomRightX - el.TopLeftX + 1) - width), 2);
                //console.log(offset, width, el.BottomRightX, el.TopLeftX, el);
                var topoffset = div(((el.BottomRightY - el.TopLeftY + 1) - block[0].height), 2);
                //console.log(topoffset, block[0].height, el.BottomRightY, el.TopLeftY);
                while (block.length) {
                    t = block.pop();
                    t.style.left = el.TopLeftX + offset + "px";
                    t.style.top = el.TopLeftY + topoffset + "px";
                    view.insert(t, cls);
                    offset += t.width + el.Spacing;
                }
            } else {
                UIkit.notification("Site author is too lazy to do this <b>(" + el.Alignment + ")</b> type of alignment... But you can send him your watchface and he will do it for you", {
                    status: 'warning',
                    pos: 'top-left',
                    timeout: 7500
                });
            }
        },
        makeBlock: function (el, value) {
            value = value.toString();
            var block = Array(),
                width = 0,
                t;
            while (value != "") {
                t = $c(el.ImageIndex + Number(value[0]));
                block.push(t);
                width += t.width + el.Spacing;
                value = value.substr(1);
            }
            width = width - el.Spacing;
            return {
                block,
                width
            }
        },
        time_change: function () {
            var t = $("in-time").value.split(":");
            data.timeOnClock[0] = t[0];
            data.timeOnClock[1] = t[1];
            data.analog[0] = (t[0] > 12 ? t[0] - 12 : t[0]) * 30 + t[1] * 0.5;
            data.analog[1] = t[1] * 6;
            $("svg-cont-clock").innerHTML = '';
            if ('AnalogDialFace' in coords) {
                if ('Hours' in coords.AnalogDialFace)
                    draw.analog.hours();
                if ('Minutes' in coords.AnalogDialFace)
                    draw.analog.minutes();
                if ('Seconds' in coords.AnalogDialFace)
                    draw.analog.seconds();
            }
            removeByClass("c_time");
            if ('Time' in coords)
                draw.time.time();
        },
        date_change: function () {
            var t = $("in-date").valueAsDate;
            try {
                data.day = t.getDate();
                data.month = t.getMonth() + 1;
                data.weekDay = t.getDay() > 0 ? t.getDay() - 1 : 6;
                removeByClass("c_date_sepday");
                removeByClass("c_date_weekday");
                removeByClass("c_date_sepmonth");
                removeByClass("c_date_oneline");
                if ('Date' in coords) {
                    if ('WeekDay' in coords.Date)
                        draw.date.weekday();
                    if ('MonthAndDay' in coords.Date) {
                        if ('Separate' in coords.Date.MonthAndDay) {
                            if ('Day' in coords.Date.MonthAndDay.Separate)
                                draw.date.sepday();
                            if ('Month' in coords.Date.MonthAndDay.Separate)
                                draw.date.sepmonth();
                        }
                        if ('OneLine' in coords.Date.MonthAndDay)
                            draw.date.oneline();
                    }
                }
            } catch (e) {}
        },
        sec_change: function () {
            if ($("in-sec").value > 59) $("in-sec").value = 59;
            if ($("in-sec").value < 0) $("in-sec").value = 0;
            var sec = $("in-sec").value;
            data.seconds[0] = Number(sec.split("")[0]);
            data.seconds[1] = Number((sec.split("").length == 1 ? 0 : sec.split("")[1]));
            data.analog[2] = sec * 6;
            $("svg-cont-clock").innerHTML = '';
            if ('AnalogDialFace' in coords) {
                if ('Hours' in coords.AnalogDialFace)
                    draw.analog.hours();
                if ('Minutes' in coords.AnalogDialFace)
                    draw.analog.minutes();
                if ('Seconds' in coords.AnalogDialFace)
                    draw.analog.seconds();
            }
            removeByClass("c_sec");
            if ('Time' in coords)
                if ('Seconds' in coords.Time)
                    draw.time.seconds();
        },
        battery_change: function () {
            if ($("in-battery").value > 100) $("in-battery").value = 100;
            if ($("in-battery").value < 0) $("in-battery").value = 0;
            data.batteryT = $("in-battery").value;
            removeByClass("c_battery_icon");
            removeByClass("c_battery_scale");
            removeByClass("c_battery_text");
            if ('Battery' in coords) {
                if ('Icon' in coords.Battery)
                    draw.battery.icon();
                if ('Text' in coords.Battery)
                    draw.battery.text();
                if ('Scale' in coords.Battery)
                    draw.battery.scale();
            }
        },
        alarm_change: function () {
            data.alarm = $("in-alarm").checked;
            removeByClass("c_stat_alarm");
            if ('Status' in coords)
                if ('Alarm' in coords.Status)
                    draw.status.alarm();
        },
        bt_change: function () {
            data.bluetooth = $("in-bt").checked;
            removeByClass("c_stat_bt");
            if ('Status' in coords)
                if ('Bluetooth' in coords.Status)
                    draw.status.bt();

        },
        dnd_change: function () {
            data.dnd = $("in-dnd").checked;
            removeByClass("c_stat_dnd");
            if ('Status' in coords)
                if ('DoNotDisturb' in coords.Status)
                    draw.status.dnd();
        },
        lock_change: function () {
            data.lock = $("in-lock").checked;
            removeByClass("c_stat_lock");
            if ('Status' in coords)
                if ('Lock' in coords.Status)
                    draw.status.lock();
        },
        steps_change: function () {
            if ($("in-steps").value > 99999) $("in-steps").value = 99999;
            if ($("in-steps").value < 0) $("in-steps").value = 0;
            data.steps = $("in-steps").value;
            removeByClass("c_act_steps");
            if ('Activity' in coords)
                if ('Steps' in coords.Activity)
                    draw.activity.steps();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            $("svg-cont-steps").innerHTML = '';
            if ('StepsProgress' in coords) {
                if ('Circle' in coords.StepsProgress)
                    draw.stepsprogress.circle();
                if ('Linear' in coords.StepsProgress)
                    draw.stepsprogress.linear();
                if ('GoalImage' in coords.StepsProgress && data.steps >= data.stepsgoal)
                    draw.stepsprogress.goal();
            }
        },
        distance_change: function () {
            if ($("in-distance").value > 99) $("in-distance").value = 99;
            if ($("in-distance").value < 0) $("in-distance").value = 0;
            var dist = $("in-distance").value.split(".");
            data.distance[0] = Number(dist[0]);
            data.distance[1] = dist.length > 1 ? dist[1].slice(0, 2) : "00";
            removeByClass("c_act_distance");
            if ('Activity' in coords)
                if ('Distance' in coords.Activity)
                    draw.activity.distance();
        },
        pulse_change: function () {
            if ($("in-pulse").value > 999) $("in-pulse").value = 999;
            if ($("in-pulse").value < 0) $("in-pulse").value = 0;
            data.pulse = $("in-pulse").value;
            removeByClass("c_act_pulse");
            if ('Activity' in coords)
                if ('Pulse' in coords.Activity)
                    draw.activity.pulse();
        },
        calories_change: function () {
            if ($("in-calories").value > 9999) $("in-calories").value = 9999;
            if ($("in-calories").value < 0) $("in-calories").value = 0;
            data.calories = $("in-calories").value;
            removeByClass("c_act_cal");
            if ('Activity' in coords)
                if ('Calories' in coords.Activity)
                    draw.activity.cal();
        },
        stepsgoal_change: function () {
            if ($("in-stepsgoal").value > 99999) $("in-stepsgoal").value = 99999;
            if ($("in-stepsgoal").value < 0) $("in-stepsgoal").value = 0;
            data.stepsgoal = $("in-stepsgoal").value;
            removeByClass("c_act_stepsgoal");
            if ('Activity' in coords)
                if ('StepsGoal' in coords.Activity)
                    draw.activity.stepsgoal();
            removeByClass("c_steps_linear");
            removeByClass("c_steps_goal");
            if ('StepsProgress' in coords) {
                if ('Circle' in coords.StepsProgress)
                    draw.stepsprogress.circle();
                if ('Linear' in coords.StepsProgress)
                    draw.stepsprogress.linear();
                if ('GoalImage' in coords.StepsProgress && data.steps >= data.stepsgoal)
                    draw.stepsprogress.goal();
            }
        },
        weatherd_change: function () {
            if ($("in-weatherd").value > 99) $("in-weatherd").value = 99;
            if ($("in-weatherd").value < -99) $("in-weatherd").value = -99;
            data.temp[0] = $("in-weatherd").value;
            removeByClass("c_temp_sep_day");
            removeByClass("c_temp_cur");
            removeByClass("c_temp_oneline");
            if ('Weather' in coords) {
                if ('Icon' in coords.Weather)
                    draw.weather.icon();
                if ('Temperature' in coords.Weather) {
                    if ('Today' in coords.Weather.Temperature) {
                        if ('OneLine' in coords.Weather.Temperature.Today)
                            draw.weather.temp.oneline();
                        if ('Separate' in coords.Weather.Temperature.Today) {
                            if ('Day' in coords.Weather.Temperature.Today.Separate)
                                draw.weather.temp.sep.day();
                            if ('Night' in coords.Weather.Temperature.Today.Separate)
                                draw.weather.temp.sep.night();
                        }
                    }
                    if ('Current' in coords.Weather.Temperature)
                        draw.weather.temp.current();
                }
                if ('AirPollution' in coords.Weather)
                    draw.weather.air();
            }
        },
        weathern_change: function () {
            if ($("in-weathern").value > 99) $("in-weathern").value = 99;
            if ($("in-weathern").value < -99) $("in-weathern").value = -99;
            data.temp[1] = $("in-weathern").value;
            removeByClass("c_temp_sep_night");
            removeByClass("c_temp_oneline");
            if ('Weather' in coords)
                if ('Temperature' in coords.Weather)
                    if ('Today' in coords.Weather.Temperature) {
                        if ('OneLine' in coords.Weather.Temperature.Today)
                            draw.weather.temp.oneline();
                        if ('Separate' in coords.Weather.Temperature.Today) {
                            if ('Day' in coords.Weather.Temperature.Today.Separate)
                                draw.weather.temp.sep.day();
                            if ('Night' in coords.Weather.Temperature.Today.Separate)
                                draw.weather.temp.sep.night();
                        }
                    }
        },
        weathericon_change: function () {
            if ($("in-weatheri").value > 26) $("in-weatheri").value = 26;
            if ($("in-weatheri").value < 1) $("in-weatheri").value = 1;
            data.weathericon = $("in-weatheri").value - 1;
            removeByClass("c_weather_icon");
            if ('Weather' in coords)
                if ('Icon' in coords.Weather)
                    draw.weather.icon();
        }
    },
    load = {
        disableBtn: function (i) {
            if (i) {
                $("editbutton").classList.remove("uk-disabled");
                $("makepng").removeAttribute("disabled");
                $("viewsettings").removeAttribute("disabled");
                $("codeopenbutton").classList.remove("uk-disabled");
                $("imagesbutton").classList.remove("uk-disabled");
                setTimeout(view.makeWf, 300);
            } else {
                $("editbutton").classList.add("uk-disabled");
                $("makepng").setAttribute("disabled", "");
                $("viewsettings").setAttribute("disabled", "");
                $("codeopenbutton").classList.add("uk-disabled");
                $("imagesbutton").classList.add("uk-disabled");
            }
        },
        clearjs: function () {
            $('inputjs').value = '';
            coords = 0;
            data.jsset = false;
            if ($('inputjs').nextElementSibling.classList.contains("uk-label-success"))
                $('inputjs').nextElementSibling.classList.remove("uk-label-success");
            $('inputjs').nextElementSibling.classList.add("uk-button-danger");
            load.disableBtn(0);
        },
        clearimg: function () {
            $('inputimages').value = '';
            $('allimages').innerHTML = '';
            data.imagesset = false;
            if ($('inputimages').nextElementSibling.classList.contains("uk-label-success")) $('inputimages').nextElementSibling.classList.remove("uk-label-success");
            $('inputimages').nextElementSibling.classList.add("uk-button-danger");
            load.disableBtn(0);
        },
        renderImage: function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                the_url = event.target.result;
                if (!(isNaN(Number(file.name.replace('.png', ''))))) {
                    $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + Number(file.name.replace('.png', '')) + "\" >";
                } else if (file.name == "weather.png") {
                    $('weather').parentNode.removeChild($('weather'));
                    $('allimages').innerHTML += "<img src=\"" + the_url + "\" id=\"" + file.name.replace('.png', '') + "\" >";
                }
            }
            reader.readAsDataURL(file);
            delete reader;
        }
    },
    draw = {
        time: {
            time: function () {
                var ntimeOnClock = data.timeOnClock[0];
                if ('AmPm' in coords.Time) {
                    var am = 1;
                    if (Number(ntimeOnClock) > 12) {
                        ntimeOnClock = (Number(ntimeOnClock) - 12).toString();
                        if (ntimeOnClock.length == 1)
                            ntimeOnClock = "0" + ntimeOnClock;
                        am = 0;
                    }
                    t = am ? $c(coords.Time.AmPm.ImageIndexAm) : $c(coords.Time.AmPm.ImageIndexPm);
                    view.setPos(t, coords.Time.AmPm);
                    view.insert(t, "c_time_am");

                }
                view.setPosN(coords.Time.Hours.Tens, Number(ntimeOnClock[0]), "c_time");
                view.setPosN(coords.Time.Hours.Ones, Number(ntimeOnClock[1]), "c_time");
                view.setPosN(coords.Time.Minutes.Tens, Number(data.timeOnClock[1][0]), "c_time");
                view.setPosN(coords.Time.Minutes.Ones, Number(data.timeOnClock[1][1]), "c_time");
            },
            seconds: function () {
                view.setPosN(coords.Time.Seconds.Tens, data.seconds[0], "c_sec");
                view.setPosN(coords.Time.Seconds.Ones, data.seconds[1], "c_sec");
            }
        },
        date: {
            weekday: function () {
                view.setPosN(coords.Date.WeekDay, data.weekDay, "c_date_weekday");
            },
            sepday: function () {
                var t = view.makeBlock(coords.Date.MonthAndDay.Separate.Day, data.day);
                if (coords.Date.MonthAndDay.TwoDigitsDay)
                    if (!div(data.day, 10)) {
                        t.block.splice(-1, 0, $c(coords.Date.MonthAndDay.Separate.Day.ImageIndex));
                        t.width += $(coords.Date.MonthAndDay.Separate.Day.ImageIndex).width + coords.Date.MonthAndDay.Separate.Day.Spacing;
                    }
                view.renderBlock(t.block, t.width, coords.Date.MonthAndDay.Separate.Day, "c_date_sepday");
            },
            sepmonth: function () {
                var t = view.makeBlock(coords.Date.MonthAndDay.Separate.Month, data.month);
                if (coords.Date.MonthAndDay.TwoDigitsMonth)
                    if (!div(data.month, 10)) {
                        t.block.splice(-1, 0, $c(coords.Date.MonthAndDay.Separate.Month.ImageIndex));
                        t.width += $(coords.Date.MonthAndDay.Separate.Month.ImageIndex).width + coords.Date.MonthAndDay.Separate.Month.Spacing;
                    }
                view.renderBlock(t.block, t.width, coords.Date.MonthAndDay.Separate.Month, "c_date_sepmonth");
            },
            oneline: function () {
                var dot = $c(coords.Date.MonthAndDay.OneLine.DelimiterImageIndex);
                t = view.makeBlock(coords.Date.MonthAndDay.OneLine.Number, data.month);
                if (coords.Date.MonthAndDay.TwoDigitsMonth)
                    if (!div(data.month, 10)) {
                        t.block.splice(-1, 0, $c(coords.Date.MonthAndDay.OneLine.Number.ImageIndex));
                        t.width += $(coords.Date.MonthAndDay.OneLine.Number.ImageIndex).width + coords.Date.MonthAndDay.OneLine.Number.Spacing;
                    }
                t.block.push(dot);
                t.width += dot.width + coords.Date.MonthAndDay.OneLine.Number.Spacing;
                var t2 = view.makeBlock(coords.Date.MonthAndDay.OneLine.Number, data.day);
                t.block = t.block.concat(t2.block);
                if (coords.Date.MonthAndDay.TwoDigitsDay)
                    if (!div(data.day, 10)) {
                        t.block.splice(-1, 0, $c(coords.Date.MonthAndDay.OneLine.Number.ImageIndex));
                        t.width += $(coords.Date.MonthAndDay.OneLine.Number.ImageIndex).width + coords.Date.MonthAndDay.OneLine.Number.Spacing;
                    }
                t.width += t2.width;
                view.renderBlock(t.block, t.width, coords.Date.MonthAndDay.OneLine.Number, "c_date_oneline");
            }

        },
        battery: {
            icon: function () {
                var battery = Math.round(data.batteryT / (100 / (coords.Battery.Icon.ImagesCount - 1)));
                view.setPosN(coords.Battery.Icon, battery, "c_battery_icon");
            },
            text: function () {
                view.setTextPos(coords.Battery.Text, data.batteryT, "c_battery_text");
            },
            scale: function () {
                var end = Math.round(data.batteryT / (100 / (coords.Battery.Scale.Segments.length - 1)));
                for (var i = 0; i <= end; i++) {
                    t = $c(coords.Battery.Scale.StartImageIndex + i);
                    view.setPos(t, coords.Battery.Scale.Segments[i]);
                    view.insert(t, "c_battery_scale");
                }
            }
        },
        analog: {
            hours: function () {
                view.drawAnalog(coords.AnalogDialFace.Hours, data.analog[0]);
            },
            minutes: function () {
                view.drawAnalog(coords.AnalogDialFace.Minutes, data.analog[1]);
            },
            seconds: function () {
                view.drawAnalog(coords.AnalogDialFace.Seconds, data.analog[2]);
            }
        },
        status: {
            alarm: function () {
                if ('ImageIndexOff' in coords.Status.Alarm && !data.alarm)
                    t = $c(coords.Status.Alarm.ImageIndexOff);
                else if (data.alarm)
                    t = $c(coords.Status.Alarm.ImageIndexOn);
                else return;
                t.style.left = coords.Status.Alarm.Coordinates.X + "px";
                t.style.top = coords.Status.Alarm.Coordinates.Y + "px";
                view.insert(t, "c_stat_alarm");
            },
            bt: function () {
                if ('ImageIndexOff' in coords.Status.Bluetooth && !data.bluetooth)
                    t = $c(coords.Status.Bluetooth.ImageIndexOff);
                else if ('ImageIndexOn' in coords.Status.Bluetooth && data.bluetooth)
                    t = $c(coords.Status.Bluetooth.ImageIndexOn);
                else return;
                t.style.left = coords.Status.Bluetooth.Coordinates.X + "px";
                t.style.top = coords.Status.Bluetooth.Coordinates.Y + "px";
                view.insert(t, "c_stat_bt");
            },
            dnd: function () {
                if ('ImageIndexOff' in coords.Status.DoNotDisturb && !data.dnd)
                    t = $c(coords.Status.DoNotDisturb.ImageIndexOff);
                else if (data.dnd)
                    t = $c(coords.Status.DoNotDisturb.ImageIndexOn);
                else return;
                t.style.left = coords.Status.DoNotDisturb.Coordinates.X + "px";
                t.style.top = coords.Status.DoNotDisturb.Coordinates.Y + "px";
                view.insert(t, "c_stat_dnd");
            },
            lock: function () {
                if ('ImageIndexOff' in coords.Status.Lock && !data.lock)
                    t = $c(coords.Status.Lock.ImageIndexOff);
                else if (data.lock)
                    t = $c(coords.Status.Lock.ImageIndexOn);
                else return;
                t.style.left = coords.Status.Lock.Coordinates.X + "px";
                t.style.top = coords.Status.Lock.Coordinates.Y + "px";
                view.insert(t, "c_stat_lock");
            }
        },
        activity: {
            cal: function () {
                view.setTextPos(coords.Activity.Calories, data.calories, "c_act_cal");
            },
            steps: function () {
                view.setTextPos(coords.Activity.Steps, data.steps, "c_act_steps");
            },
            stepsgoal: function () {
                view.setTextPos(coords.Activity.StepsGoal, data.stepsgoal, "c_act_stepsg");
            },
            pulse: function () {
                view.setTextPos(coords.Activity.Pulse, data.pulse, "c_act_pulse");
            },
            distance: function () {
                var dot = $c(coords.Activity.Distance.DecimalPointImageIndex),
                    km = $c(coords.Activity.Distance.SuffixImageIndex);
                t = view.makeBlock(coords.Activity.Distance.Number, data.distance[0]);
                t.block.push(dot);
                t.width += dot.width + coords.Activity.Distance.Number.Spacing;
                var t2 = view.makeBlock(coords.Activity.Distance.Number, data.distance[1]);
                t.block = t.block.concat(t2.block);
                t.width += t2.width;
                t.block.push(km);
                t.width += km.width;
                view.renderBlock(t.block, t.width, coords.Activity.Distance.Number, "c_act_distance");
            }
        },
        stepsprogress: {
            circle: function () {
                var col = coords.StepsProgress.Circle.Color.replace("0x", "#"),
                    full = Math.floor(2 * coords.StepsProgress.Circle.RadiusX * Math.PI / 360 * (coords.StepsProgress.Circle.EndAngle - coords.StepsProgress.Circle.StartAngle));
                var fill = Math.round(data.steps / (data.stepsgoal / full));
                if (fill > full) fill = full;
                $('svg-cont-steps').innerHTML += "<ellipse transform=\"rotate(" + (-90 + coords.StepsProgress.Circle.StartAngle) + " " + coords.StepsProgress.Circle.CenterX + " " + coords.StepsProgress.Circle.CenterY + ")\" cx=\"" + coords.StepsProgress.Circle.CenterX + "\" cy=\"" + coords.StepsProgress.Circle.CenterY + "\" rx=\"" + coords.StepsProgress.Circle.RadiusX + "\" ry=\"" + coords.StepsProgress.Circle.RadiusY + "\" fill=\"rgba(255,255,255,0)\" stroke-width=\"" + coords.StepsProgress.Circle.Width + "\" stroke=\"" + col + "\" stroke-dasharray=\"" + fill + " " + (full - fill) + "\" stroke-linecap=\"none\"></ellipse>";
            },
            linear: function () {
                var end = Math.round(data.steps / (data.stepsgoal / (coords.StepsProgress.Linear.Segments.length))) - 1;
                if (end > coords.StepsProgress.Linear.Segments.length - 1)
                    end = coords.StepsProgress.Linear.Segments.length - 1;
                for (var i = 0; i <= end; i++) {
                    t = $c(coords.StepsProgress.Linear.StartImageIndex + i);
                    view.setPos(t, coords.StepsProgress.Linear.Segments[i]);
                    view.insert(t, "c_steps_linear");
                }
            },
            goal: function () {
                view.setPosN(coords.StepsProgress.GoalImage, 0, "c_steps_goal");
            }
        },
        weather: {
            icon: function () {
                if ('CustomIcon' in coords.Weather.Icon) {
                    t = $c(coords.Weather.Icon.CustomIcon.ImageIndex + data.weathericon);
                    t.style.left = coords.Weather.Icon.CustomIcon.X + "px";
                    t.style.top = coords.Weather.Icon.CustomIcon.Y + "px";
                    view.insert(t, "c_weather_icon");
                } else {
                    t = $c("weather");
                    t.style.left = coords.Weather.Icon.Coordinates.X + "px";
                    t.style.top = coords.Weather.Icon.Coordinates.Y + "px";
                    view.insert(t, "c_weather_icon");
                }
            },
            temp: {
                oneline: function () {
                    var sep = $c(coords.Weather.Temperature.Today.OneLine.DelimiterImageIndex),
                        deg = $c(coords.Weather.Temperature.Today.OneLine.DegreesImageIndex),
                        minus = data.temp[0] < 0 ? $c(coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex) : 0;
                    t = view.makeBlock(coords.Weather.Temperature.Today.OneLine.Number, Math.abs(data.temp[0]));
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    t.block.push(sep);
                    t.width += sep.width + coords.Weather.Temperature.Today.OneLine.Number.Spacing;
                    var t2 = view.makeBlock(coords.Weather.Temperature.Today.OneLine.Number, Math.abs(data.temp[1]));
                    minus = data.temp[1] < 0 ? $c(coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex) : 0;
                    if (minus != 0) {
                        t2.block.splice(0, 0, minus);
                        t2.width += minus.width;
                    }
                    t.block = t.block.concat(t2.block);
                    t.width += t2.width;
                    t.block.push(deg);
                    t.width += deg.width;
                    view.renderBlock(t.block, t.width, coords.Weather.Temperature.Today.OneLine.Number, "c_temp_oneline");
                },
                sep: {
                    day: function () {
                        var minus = data.temp[0] < 0 ? $c(coords.Weather.Temperature.Today.Separate.Day.MinusImageIndex) : 0;
                        t = view.makeBlock(coords.Weather.Temperature.Today.Separate.Day.Number, Math.abs(data.temp[0]));
                        if ('DegreesImageIndex' in coords.Weather.Temperature.Today.Separate.Day) {
                            var deg = $c(coords.Weather.Temperature.Today.Separate.Day.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + coords.Weather.Temperature.Today.Separate.Day.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, coords.Weather.Temperature.Today.Separate.Day.Number, "c_temp_sep_day");
                    },
                    night: function () {
                        var minus = data.temp[1] < 0 ? $c(coords.Weather.Temperature.Today.Separate.Night.MinusImageIndex) : 0;
                        t = view.makeBlock(coords.Weather.Temperature.Today.Separate.Night.Number, Math.abs(data.temp[1]));
                        if ('DegreesImageIndex' in coords.Weather.Temperature.Today.Separate.Night) {
                            var deg = $c(coords.Weather.Temperature.Today.Separate.Night.DegreesImageIndex);
                            t.block.push(deg);
                            t.width += deg.width + coords.Weather.Temperature.Today.Separate.Night.Number.Spacing;
                        }
                        if (minus != 0) {
                            t.block.splice(0, 0, minus);
                            t.width += minus.width;
                        }
                        view.renderBlock(t.block, t.width, coords.Weather.Temperature.Today.Separate.Night.Number, "c_temp_sep_night");
                    }
                },
                current: function () {
                    var minus = data.temp[0] < 0 ? $c(coords.Weather.Temperature.Current.MinusImageIndex) : 0;
                    t = view.makeBlock(coords.Weather.Temperature.Current.Number, Math.abs(data.temp[0]));
                    if ('DegreesImageIndex' in coords.Weather.Temperature.Current) {
                        var deg = $c(coords.Weather.Temperature.Current.DegreesImageIndex);
                        t.block.push(deg);
                        t.width += deg.width + coords.Weather.Temperature.Current.Number.Spacing;
                    }
                    if (minus != 0) {
                        t.block.splice(0, 0, minus);
                        t.width += minus.width;
                    }
                    view.renderBlock(t.block, t.width, coords.Weather.Temperature.Current.Number, "c_temp_cur");
                }
            },
            air: function () {
                view.setPosN(coords.Weather.AirPollution.Icon, 0, "c_air");
            }
        }
    },
    editor = {
        makeBlock: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ((el.BottomRightY - el.TopLeftY + 1) * 3) + 'px; width:' + ((el.BottomRightX - el.TopLeftX + 1) * 3) + 'px; top:' + (el.TopLeftY * 3) + 'px; left:' + (el.TopLeftX * 3) + 'px;" class="editor-elem"></div>';
        },
        makeImg: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ($(el.ImageIndex).height * 3) + 'px; width:' + ($(el.ImageIndex).width * 3) + 'px; top:' + (el.Y * 3) + 'px; left:' + (el.X * 3) + 'px;" class="editor-elem"></div>';
        },
        makeImgStat: function (el, id) {
            $("editor").innerHTML +=
                '<div id="' + id + '" style="height:' + ($('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).height * 3) + 'px; width:' + ($('ImageIndexOn' in el ? el.ImageIndexOn : el.ImageIndexOff).width * 3) + 'px; top:' + (el.Coordinates.Y * 3) + 'px; left:' + (el.Coordinates.X * 3) + 'px;" class="editor-elem"></div>';
        },
        styleToNum: function (el) {
            return Number(el.replace('px', ''));
        },
        init: function () {
            if (!('designtabversion' in localStorage) || localStorage.designtabversion < data.app.designtabversion)
                localStorage.designtabversion = data.app.designtabversion;
            $("editor").innerHTML = '';
            if ('Background' in coords) {
                var bg = $c(coords.Background.Image.ImageIndex);
                bg.style.left = Number(bg.style.left.replace("px", "")) * 3 + "px";
                bg.style.top = Number(bg.style.top.replace("px", "")) * 3 + "px";
                bg.height *= 3;
                bg.width *= 3;
                bg.removeAttribute("id");
                $("editor").appendChild(bg);
                setTimeout(function () {
                    $("editor").childNodes[0].ondragstart = function () {
                        return false;
                    }
                }, 10);
            }
            if ('Time' in coords) {
                this.makeImg(coords.Time.Hours.Tens, "e_time_ht");
                this.makeImg(coords.Time.Hours.Ones, "e_time_ho");
                this.makeImg(coords.Time.Minutes.Tens, "e_time_mt");
                this.makeImg(coords.Time.Minutes.Ones, "e_time_mo");
                setTimeout(function () {
                    editor.initdrag('e_time_ht', coords.Time.Hours.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_ho', coords.Time.Hours.Ones, "c_time", draw.time.time);
                    editor.initdrag('e_time_mt', coords.Time.Minutes.Tens, "c_time", draw.time.time);
                    editor.initdrag('e_time_mo', coords.Time.Minutes.Ones, "c_time", draw.time.time);
                }, 10);
                if ('Seconds' in coords.Time) {
                    this.makeImg(coords.Time.Seconds.Tens, "e_time_st");
                    this.makeImg(coords.Time.Seconds.Ones, "e_time_so");
                    setTimeout(function () {
                        editor.initdrag('e_time_st', coords.Time.Seconds.Tens, "c_sec", draw.time.seconds);
                        editor.initdrag('e_time_so', coords.Time.Seconds.Ones, "c_sec", draw.time.seconds);
                    }, 10);
                }
                if ('AmPm' in coords.Time) {
                    $("editor").innerHTML +=
                        '<div id="e_time_am" style="height:' + ($(coords.Time.AmPm.ImageIndexAm).height * 3) + 'px; width:' + ($(coords.Time.AmPm.ImageIndexAm).width * 3) + 'px; top:' + (coords.Time.AmPm.Y * 3) + 'px; left:' + (coords.Time.AmPm.X * 3) + 'px;" class="editor-elem"></div>';
                    setTimeout(function () {
                        editor.initdrag('e_time_am', coords.Time.AmPm, "c_time_am", draw.time.time);
                    }, 10);
                }
            }
            if ('Date' in coords) {
                if ('WeekDay' in coords.Date) {
                    this.makeImg(coords.Date.WeekDay, "e_date_weekday");
                    setTimeout(function () {
                        editor.initdrag('e_date_weekday', coords.Date.WeekDay, "c_date_weekday", draw.date.weekday);
                    }, 10);
                }
                if ('MonthAndDay' in coords.Date) {
                    if ('Separate' in coords.Date.MonthAndDay) {
                        if ('Day' in coords.Date.MonthAndDay.Separate) {
                            this.makeBlock(coords.Date.MonthAndDay.Separate.Day, "e_date_sep_day");
                            setTimeout(function () {
                                editor.initdrag('e_date_sep_day', coords.Date.MonthAndDay.Separate.Day, "c_date_sepday", draw.date.sepday);
                            }, 10);
                        }
                        if ('Month' in coords.Date.MonthAndDay.Separate) {
                            this.makeBlock(coords.Date.MonthAndDay.Separate.Month, "e_date_sep_month");
                            setTimeout(function () {
                                editor.initdrag('e_date_sep_month', coords.Date.MonthAndDay.Separate.Month, "c_date_sepmonth", draw.date.sepmonth);
                            }, 10);
                        }
                    }
                    if ('OneLine' in coords.Date.MonthAndDay) {
                        this.makeBlock(coords.Date.MonthAndDay.OneLine.Number, "e_date_oneline");
                        setTimeout(function () {
                            editor.initdrag('e_date_oneline', coords.Date.MonthAndDay.OneLine.Number, "c_date_oneline", draw.date.oneline);
                        }, 10);
                    }
                }
            }
            if ('Activity' in coords) {
                if ('Calories' in coords.Activity) {
                    this.makeBlock(coords.Activity.Calories, "e_act_cal");
                    setTimeout(function () {
                        editor.initdrag('e_act_cal', coords.Activity.Calories, "c_act_cal", draw.activity.cal);
                    }, 10);
                }
                if ('Steps' in coords.Activity) {
                    this.makeBlock(coords.Activity.Steps, "e_act_steps");
                    setTimeout(function () {
                        editor.initdrag('e_act_steps', coords.Activity.Steps, "c_act_steps", draw.activity.steps);
                    }, 10);
                }
                if ('StepsGoal' in coords.Activity) {
                    this.makeBlock(coords.Activity.StepsGoal, "e_act_stepsgoal");
                    setTimeout(function () {
                        editor.initdrag('e_act_stepsgoal', coords.Activity.StepsGoal, "c_act_stepsg", draw.activity.stepsgoal);
                    }, 10);
                }
                if ('Pulse' in coords.Activity) {
                    this.makeBlock(coords.Activity.Pulse, "e_act_pulse");
                    setTimeout(function () {
                        editor.initdrag('e_act_pulse', coords.Activity.Pulse, "c_act_pulse", draw.activity.pulse);
                    }, 10);
                }
                if ('Distance' in coords.Activity) {
                    this.makeBlock(coords.Activity.Distance.Number, "e_act_distance");
                    setTimeout(function () {
                        editor.initdrag('e_act_distance', coords.Activity.Distance.Number, "c_act_distance", draw.activity.distance);
                    }, 10);
                }
            }
            if ('Battery' in coords) {
                if ('Icon' in coords.Battery) {
                    this.makeImg(coords.Battery.Icon, "e_battery_icon");
                    setTimeout(function () {
                        editor.initdrag('e_battery_icon', coords.Battery.Icon, "c_battery_icon", draw.battery.icon);
                    }, 10);
                }
                if ('Text' in coords.Battery) {
                    this.makeBlock(coords.Battery.Text, "e_battery_text");
                    setTimeout(function () {
                        editor.initdrag('e_battery_text', coords.Battery.Text, "c_battery_text", draw.battery.text);
                    }, 10);
                }
                if ('Scale' in coords.Battery) {}
            }
            if ('Status' in coords) {
                if ('Alarm' in coords.Status) {
                    this.makeImgStat(coords.Status.Alarm, "e_stat_alarm");
                    setTimeout(function () {
                        editor.initdrag('e_stat_alarm', coords.Status.Alarm.Coordinates, "c_stat_alarm", draw.status.alarm);
                    }, 10);
                }
                if ('Bluetooth' in coords.Status) {
                    this.makeImgStat(coords.Status.Bluetooth, "e_stat_bt");
                    setTimeout(function () {
                        editor.initdrag('e_stat_bt', coords.Status.Bluetooth.Coordinates, "c_stat_bt", draw.status.bt);
                    }, 10);
                }
                if ('DoNotDisturb' in coords.Status) {
                    this.makeImgStat(coords.Status.DoNotDisturb, "e_stat_dnd");
                    setTimeout(function () {
                        editor.initdrag('e_stat_dnd', coords.Status.DoNotDisturb.Coordinates, "c_stat_dnd", draw.status.dnd);
                    }, 10);
                }
                if ('Lock' in coords.Status) {
                    this.makeImgStat(coords.Status.Lock, "e_stat_lock");
                    setTimeout(function () {
                        editor.initdrag('e_stat_lock', coords.Status.Lock.Coordinates, "c_stat_lock", draw.status.lock);
                    }, 10);
                }
            }
            if ('Weather' in coords) {
                if ('Icon' in coords.Weather) {
                    if ('CustomIcon' in coords.Weather.Icon) {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($(coords.Weather.Icon.CustomIcon.ImageIndex).height * 3) + 'px; width:' + ($(coords.Weather.Icon.CustomIcon.ImageIndex).width * 3) + 'px; top:' + (coords.Weather.Icon.CustomIcon.Y * 3) + 'px; left:' + (coords.Weather.Icon.CustomIcon.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', coords.Weather.Icon.CustomIcon, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    } else {
                        $("editor").innerHTML +=
                            '<div id="e_weather_icon" style="height:' + ($("weather").height * 3) + 'px; width:' + ($("weather").width * 3) + 'px; top:' + (coords.Weather.Icon.Coordinates.Y * 3) + 'px; left:' + (coords.Weather.Icon.Coordinates.X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function () {
                            editor.initdrag('e_weather_icon', coords.Weather.Icon.Coordinates, "c_weather_icon", draw.weather.icon);
                        }, 10);
                    }
                }
                if ('Temperature' in coords.Weather) {
                    if ('Today' in coords.Weather.Temperature) {
                        if ('OneLine' in coords.Weather.Temperature.Today) {
                            this.makeBlock(coords.Weather.Temperature.Today.OneLine.Number, "e_weather_temp_today_oneline");
                            setTimeout(function () {
                                editor.initdrag('e_weather_temp_today_oneline', coords.Weather.Temperature.Today.OneLine.Number, "c_temp_oneline", draw.weather.temp.oneline);
                            }, 10);
                        }
                        if ('Separate' in coords.Weather.Temperature.Today) {
                            if ('Day' in coords.Weather.Temperature.Today.Separate) {
                                this.makeBlock(coords.Weather.Temperature.Today.Separate.Day.Number, "e_weather_temp_today_sep_day");
                                setTimeout(function () {
                                    editor.initdrag('e_weather_temp_today_sep_day', coords.Weather.Temperature.Today.Separate.Day.Number, "c_temp_sep_day", draw.weather.temp.sep.day);
                                }, 10);
                            }
                            if ('Night' in coords.Weather.Temperature.Today.Separate) {
                                this.makeBlock(coords.Weather.Temperature.Today.Separate.Night.Number, "e_weather_temp_today_sep_night");
                                setTimeout(function () {
                                    editor.initdrag('e_weather_temp_today_sep_night', coords.Weather.Temperature.Today.Separate.Night.Number, "c_temp_sep_night", draw.weather.temp.sep.night);
                                }, 10);
                            }
                        }
                    }
                    if ('Current' in coords.Weather.Temperature) {
                        this.makeBlock(coords.Weather.Temperature.Current.Number, "e_weather_temp_current");
                        setTimeout(function () {
                            editor.initdrag('e_weather_temp_current', coords.Weather.Temperature.Current.Number, "c_temp_cur", draw.weather.temp.current);
                        }, 10);
                    }
                }
                if ('AirPollution' in coords.Weather) {
                    this.makeImg(coords.Weather.AirPollution.Icon, "e_weather_air");
                    setTimeout(function () {
                        editor.initdrag('e_weather_air', coords.Weather.AirPollution.Icon, "c_air", draw.weather.air);
                    }, 10);
                }
            }
            if ('StepsProgress' in coords) {
                if ('Linear' in coords.StepsProgress) {
                    for (var i = 0; i < coords.StepsProgress.Linear.Segments.length; i++) {
                        $("editor").innerHTML +=
                            '<div id="e_steps_linar_' + i + '" style="height:' + ($(coords.StepsProgress.Linear.StartImageIndex + i).height * 3) + 'px; width:' + ($(coords.StepsProgress.Linear.StartImageIndex + i).width * 3) + 'px; top:' + (coords.StepsProgress.Linear.Segments[i].Y * 3) + 'px; left:' + (coords.StepsProgress.Linear.Segments[i].X * 3) + 'px;" class="editor-elem"></div>';
                        setTimeout(function (i) {
                            editor.initdrag(('e_steps_linar_' + i), coords.StepsProgress.Linear.Segments[i], "c_steps_linear", draw.stepsprogress.linear);
                        }, 10, i);
                    }
                }
                if ('GoalImage' in coords.StepsProgress) {
                    this.makeImg(coords.StepsProgress.GoalImage, "e_steps_goal");
                    setTimeout(function () {
                        editor.initdrag('e_steps_goal', coords.StepsProgress.GoalImage, "c_steps_goal", draw.stepsprogress.goal);
                    }, 10);
                }
            }
        },
        initdrag: function (el, elcoords, cls, drawF) {
            el = $(el);

            el.onmousedown = function (e) {

                var ed = editor.getOffsetRect($("editor"));
                var coords = getCoords(el);
                var shiftX = e.pageX - coords.left;
                var shiftY = e.pageY - coords.top;

                el.style.position = 'absolute';
                moveAt(e);

                el.style.zIndex = 1000;

                function moveAt(e) {
                    el.style.left = e.pageX - ed.left - shiftX + 'px';
                    el.style.top = e.pageY - ed.top - shiftY + 'px';
                    $("e_coords").innerHTML = "X: " + (editor.styleToNum(el.style.left) - editor.styleToNum(el.style.left) % 3) / 3 + ", Y: " + (editor.styleToNum(el.style.top) - editor.styleToNum(el.style.top) % 3) / 3;
                }

                $("editor").onmousemove = function (e) {
                    moveAt(e);
                };

                el.onmouseup = function () {
                    $("editor").onmousemove = null;
                    el.onmouseup = null;
                    el.style.zIndex = 'auto';
                    el.style.top = editor.styleToNum(el.style.top) > 0 && editor.styleToNum(el.style.top) < 528 ? editor.styleToNum(el.style.top) - editor.styleToNum(el.style.top) % 3 + 'px' : "0px";
                    el.style.left = editor.styleToNum(el.style.left) > 0 && editor.styleToNum(el.style.left) < 528 ? editor.styleToNum(el.style.left) - editor.styleToNum(el.style.left) % 3 + 'px' : "0px";
                    if ('X' in elcoords) {
                        elcoords.X = editor.styleToNum(el.style.left) / 3;
                        elcoords.Y = editor.styleToNum(el.style.top) / 3;
                    } else {
                        var t1 = elcoords.TopLeftX,
                            t2 = elcoords.TopLeftY;
                        elcoords.TopLeftX = editor.styleToNum(el.style.left) / 3;
                        elcoords.TopLeftY = editor.styleToNum(el.style.top) / 3;
                        elcoords.BottomRightX += elcoords.TopLeftX - t1;
                        elcoords.BottomRightY += elcoords.TopLeftY - t2;
                    }
                    removeByClass(cls);
                    drawF();
                    $("e_coords").innerHTML = "Coordinates";
                };

            }

            el.ondragstart = function () {
                return false;
            };

            function getCoords(elem) {
                var box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }

        },
        getOffsetRect: function (elem) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return {
                top: Math.round(top),
                left: Math.round(left)
            }
        },
        calc: function (el, digitcount) {
            var width = 0,
                height = 0;
            for (var i = 0; i < el.ImagesCount; i++) {
                if ($(el.ImageIndex + i).width > width)
                    width = $(el.ImageIndex + i).width;
                if ($(el.ImageIndex + i).height > height)
                    height = $(el.ImageIndex + i).height;
            }
            width = width * digitcount + el.Spacing * (digitcount - 1);
            if (arguments.length > 2)
                for (var i = 2; i < arguments.length; i++)
                    width += $(arguments[i]).width + el.Spacing;
            if (el.Alignment == "TopRight") {
                el.BottomRightY = el.TopLeftY + height - 1;
                el.TopLeftX = el.BottomRightX - width + 1;
            } else {
                el.BottomRightY = el.TopLeftY + height - 1;
                el.BottomRightX = el.TopLeftX + width - 1;
            }
        },
        makejsbetter: function () {
            if ('Date' in coords) {
                if ('MonthAndDay' in coords.Date) {
                    if ('Separate' in coords.Date.MonthAndDay) {
                        if ('Day' in coords.Date.MonthAndDay.Separate) {
                            this.calc(coords.Date.MonthAndDay.Separate.Day, 2);
                        }
                        if ('Month' in coords.Date.MonthAndDay.Separate) {
                            this.calc(coords.Date.MonthAndDay.Separate.Month, 2);
                        }
                    }
                    if ('OneLine' in coords.Date.MonthAndDay) {
                        this.calc(coords.Date.MonthAndDay.OneLine.Number, 4, coords.Date.MonthAndDay.OneLine.DelimiterImageIndex);
                    }
                }
            }
            if ('Battery' in coords) {
                if ('Text' in coords.Battery)
                    this.calc(coords.Battery.Text, 3);
            }
            if ('Activity' in coords) {
                if ('Calories' in coords.Activity)
                    this.calc(coords.Activity.Calories, 4);
                if ('Steps' in coords.Activity)
                    this.calc(coords.Activity.Steps, 5);
                if ('StepsGoal' in coords.Activity)
                    this.calc(coords.Activity.StepsGoal, 5);
                if ('Pulse' in coords.Activity)
                    this.calc(coords.Activity.Pulse, 3);
                if ('Distance' in coords.Activity)
                    this.calc(coords.Activity.Distance.Number, 4, coords.Activity.Distance.DecimalPointImageIndex, coords.Activity.Distance.SuffixImageIndex);
            }
            if ('Weather' in coords) {
                if ('Temperature' in coords.Weather) {
                    if ('Today' in coords.Weather.Temperature) {
                        if ('OneLine' in coords.Weather.Temperature.Today)
                            this.calc(coords.Weather.Temperature.Today.OneLine.Number, 4, coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex, coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex, coords.Weather.Temperature.Today.OneLine.DelimiterImageIndex, coords.Weather.Temperature.Today.OneLine.DegreesImageIndex);
                        if ('Separate' in coords.Weather.Temperature.Today) {
                            if ('Day' in coords.Weather.Temperature.Today.Separate)
                                this.calc(coords.Weather.Temperature.Today.Separate.Day.Number, 2, coords.Weather.Temperature.Today.Separate.Day.MinusImageIndex);
                            if ('Night' in coords.Weather.Temperature.Today.Separate)
                                this.calc(coords.Weather.Temperature.Today.Separate.Night.Number, 2, coords.Weather.Temperature.Today.Separate.Night.MinusImageIndex);
                        }
                    }
                    if ('Current' in coords.Weather.Temperature)
                        this.calc(coords.Weather.Temperature.Current.Number, 2, coords.Weather.Temperature.Current.MinusImageIndex, coords.Weather.Temperature.Current.DegreesImageIndex);
                }
            }
            this.init();
            view.makeWf();
        }
    },
    jsoneditor = {
        updatecode: function () {
            $("codearea").innerHTML = jsoneditor.syntaxHighlight(JSON.stringify(coords, null, 4));
            if ($("codearea").innerHTML.replace(this.regexr, '').match(this.regexrimg))
                $("defaultimages").classList.add("uk-label-success");
            else
                $("defaultimages").classList.remove("uk-label-success");
            view.makeWf();
        },
        tgam: function () {
            if ('AmPm' in coords.Time) {
                delete coords.Time.AmPm;
            } else {
                coords.Time.AmPm = {
                    X: 0,
                    Y: 0,
                    ImageIndexAm: 233,
                    ImageIndexPm: 234
                }
            }
            this.updatecode();
            jsoneditor.select('"AmPm":');
        },
        tgsec: function () {
            if ('Seconds' in coords.Time) {
                delete coords.Time.Seconds;
            } else {
                coords.Time.Seconds = {
                    Tens: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    Ones: {
                        X: 10,
                        Y: 0,
                        ImageIndex: 200,
                        ImagesCount: 10
                    }
                };
            }
            this.updatecode();
            jsoneditor.select('"Seconds":');
        },
        tgweekday: function () {
            if (!('Date' in coords))
                coords.Date = {};
            if ('WeekDay' in coords.Date)
                delete coords.Date.WeekDay;
            else {
                coords.Date.WeekDay = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 210,
                    ImagesCount: 7
                }
            }
            if (Object.keys(coords.Date).length == 0)
                delete coords.Date;
            this.updatecode();
            jsoneditor.select('"WeekDay":');
        },
        tgdateoneline: function () {
            if (!('Date' in coords))
                coords.Date = {};
            if ('MonthAndDay' in coords.Date)
                delete coords.Date.MonthAndDay;
            else {
                coords.Date.MonthAndDay = {
                    OneLine: {
                        Number: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 45,
                            BottomRightY: 10,
                            Alignment: 'TopLeft',
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        },
                        DelimiterImageIndex: 219
                    },
                    TwoDigitsMonth: true,
                    TwoDigitsDay: true
                }
            }
            if (Object.keys(coords.Date).length == 0)
                delete coords.Date;
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgdateday: function () {
            if (!('Date' in coords))
                coords.Date = {};
            if ('MonthAndDay' in coords.Date) {
                if (!('Separate' in coords.Date.MonthAndDay))
                    delete coords.Date.MonthAndDay;
                else if ('Day' in coords.Date.MonthAndDay.Separate) {
                    delete coords.Date.MonthAndDay.Separate.Day;
                    if (!('Month' in coords.Date.MonthAndDay.Separate))
                        delete coords.Date.MonthAndDay;
                } else {
                    coords.Date.MonthAndDay.Separate.Day = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    }
                }
            } else {
                coords.Date.MonthAndDay = {
                    Separate: {
                        Day: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 20,
                            BottomRightY: 10,
                            Alignment: "TopLeft",
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        }
                    },
                    TwoDigitsMonth: true,
                    TwoDigitsDay: true
                }
            }
            if (Object.keys(coords.Date).length == 0)
                delete coords.Date;
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgdatemonth: function () {
            if (!('Date' in coords))
                coords.Date = {};
            if ('MonthAndDay' in coords.Date) {
                if (!('Separate' in coords.Date.MonthAndDay))
                    delete coords.Date.MonthAndDay;
                else if ('Month' in coords.Date.MonthAndDay.Separate) {
                    delete coords.Date.MonthAndDay.Separate.Month;
                    if (!('Day' in coords.Date.MonthAndDay.Separate))
                        delete coords.Date.MonthAndDay;
                } else {
                    coords.Date.MonthAndDay.Separate.Month = {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    }
                }
            } else {
                coords.Date.MonthAndDay = {
                    Separate: {
                        Month: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 20,
                            BottomRightY: 10,
                            Alignment: "TopLeft",
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        }
                    },
                    TwoDigitsMonth: true,
                    TwoDigitsDay: true
                }
            }
            if (Object.keys(coords.Date).length == 0)
                delete coords.Date;
            this.updatecode();
            jsoneditor.select('"MonthAndDay":');
        },
        tgstatalarm: function () {
            if (!('Status' in coords))
                coords.Status = {};
            if ('Alarm' in coords.Status)
                delete coords.Status.Alarm;
            else
                coords.Status.Alarm = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 224
                }
            if (Object.keys(coords.Status).length == 0)
                delete coords.Status;
            this.updatecode();
            jsoneditor.select('"Alarm":');
        },
        tgstatbt: function () {
            if (!('Status' in coords))
                coords.Status = {};
            if ('Bluetooth' in coords.Status)
                delete coords.Status.Bluetooth;
            else
                coords.Status.Bluetooth = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 220,
                    ImageIndexOff: 221
                }
            if (Object.keys(coords.Status).length == 0)
                delete coords.Status;
            this.updatecode();
            jsoneditor.select('"Bluetooth":');
        },
        tgstatlock: function () {
            if (!('Status' in coords))
                coords.Status = {};
            if ('Lock' in coords.Status)
                delete coords.Status.Lock;
            else
                coords.Status.Lock = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 223
                }
            if (Object.keys(coords.Status).length == 0)
                delete coords.Status;
            this.updatecode();
            jsoneditor.select('"Lock":');
        },
        tgstatdnd: function () {
            if (!('Status' in coords))
                coords.Status = {};
            if ('DoNotDisturb' in coords.Status)
                delete coords.Status.DoNotDisturb;
            else
                coords.Status.DoNotDisturb = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    },
                    ImageIndexOn: 222
                }
            if (Object.keys(coords.Status).length == 0)
                delete coords.Status;
            this.updatecode();
            jsoneditor.select('"DoNotDisturb":');
        },
        tgactsteps: function () {
            if (!('Activity' in coords))
                coords.Activity = {};
            if ('Steps' in coords.Activity)
                delete coords.Activity.Steps;
            else
                coords.Activity.Steps = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 45,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            if (Object.keys(coords.Activity).length == 0)
                delete coords.Activity;
            this.updatecode();
            jsoneditor.select('"Steps":');
        },
        tgactcal: function () {
            if (!('Activity' in coords))
                coords.Activity = {};
            if ('Calories' in coords.Activity)
                delete coords.Activity.Calories;
            else
                coords.Activity.Calories = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 35,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            if (Object.keys(coords.Activity).length == 0)
                delete coords.Activity;
            this.updatecode();
            jsoneditor.select('"Calories":');
        },
        tgactpulse: function () {
            if (!('Activity' in coords))
                coords.Activity = {};
            if ('Pulse' in coords.Activity)
                delete coords.Activity.Pulse;
            else
                coords.Activity.Pulse = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 35,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            if (Object.keys(coords.Activity).length == 0)
                delete coords.Activity;
            this.updatecode();
            jsoneditor.select('"Pulse":');
        },
        tgactstepsgoal: function () {
            if (!('Activity' in coords))
                coords.Activity = {};
            if ('StepsGoal' in coords.Activity)
                delete coords.Activity.StepsGoal;
            else
                coords.Activity.StepsGoal = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 45,
                    BottomRightY: 10,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            if (Object.keys(coords.Activity).length == 0)
                delete coords.Activity;
            this.updatecode();
            jsoneditor.select('"StepsGoal":');
        },
        tgactdist: function () {
            if (!('Activity' in coords))
                coords.Activity = {};
            if ('Distance' in coords.Activity)
                delete coords.Activity.Distance;
            else
                coords.Activity.Distance = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 45,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    SuffixImageIndex: 231,
                    DecimalPointImageIndex: 232
                }
            if (Object.keys(coords.Activity).length == 0)
                delete coords.Activity;
            this.updatecode();
            jsoneditor.select('"Distance":');
        },
        tgbatteryicon: function () {
            if (!('Battery' in coords))
                coords.Battery = {};
            if ('Icon' in coords.Battery)
                delete coords.Battery.Icon;
            else
                coords.Battery.Icon = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 225,
                    ImagesCount: 6
                }
            if (Object.keys(coords.Battery).length == 0)
                delete coords.Battery;
            this.updatecode();
            jsoneditor.select('"Battery":');
        },
        tgbatterytext: function () {
            if (!('Battery' in coords))
                coords.Battery = {};
            if ('Text' in coords.Battery)
                delete coords.Battery.Text;
            else
                coords.Battery.Text = {
                    TopLeftX: 0,
                    TopLeftY: 0,
                    BottomRightX: 10,
                    BottomRightY: 20,
                    Alignment: "TopLeft",
                    Spacing: 2,
                    ImageIndex: 200,
                    ImagesCount: 10
                }
            if (Object.keys(coords.Battery).length == 0)
                delete coords.Battery;
            this.updatecode();
            jsoneditor.select('"Battery":');
        },
        tgweathericon: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if ('Icon' in coords.Weather)
                delete coords.Weather.Icon;
            else
                coords.Weather.Icon = {
                    Coordinates: {
                        X: 0,
                        Y: 0
                    }
                }
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweathericoncustom: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if ('Icon' in coords.Weather)
                delete coords.Weather.Icon;
            else
                coords.Weather.Icon = {
                    CustomIcon: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 267,
                        ImagesCount: 26
                    }
                }
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweatherair: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if ('AirPollution' in coords.Weather)
                delete coords.Weather.AirPollution;
            else
                coords.Weather.AirPollution = {
                    Icon: {
                        X: 0,
                        Y: 0,
                        ImageIndex: 235,
                        ImagesCount: 6
                    }
                }
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Weather":');
        },
        tgweatheroneline: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if (!('Temperature' in coords.Weather))
                coords.Weather.Temperature = {};
            if ('Today' in coords.Weather.Temperature)
                delete coords.Weather.Temperature.Today;
            else {
                coords.Weather.Temperature.Today = {
                    OneLine: {
                        Number: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 50,
                            BottomRightY: 10,
                            Alignment: "TopLeft",
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        },
                        MinusSignImageIndex: 217,
                        DelimiterImageIndex: 219,
                        AppendDegreesForBoth: false,
                        DegreesImageIndex: 218
                    }
                }
            }
            if (Object.keys(coords.Weather.Temperature).length == 0)
                delete coords.Weather.Temperature;
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweathercur: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if (!('Temperature' in coords.Weather))
                coords.Weather.Temperature = {};
            if ('Current' in coords.Weather.Temperature)
                delete coords.Weather.Temperature.Current;
            else {
                coords.Weather.Temperature.Current = {
                    Number: {
                        TopLeftX: 0,
                        TopLeftY: 0,
                        BottomRightX: 20,
                        BottomRightY: 10,
                        Alignment: "TopLeft",
                        Spacing: 2,
                        ImageIndex: 200,
                        ImagesCount: 10
                    },
                    MinusImageIndex: 217,
                    DegreesImageIndex: 218
                }
            }
            if (Object.keys(coords.Weather.Temperature).length == 0)
                delete coords.Weather.Temperature;
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweathersepday: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if (!('Temperature' in coords.Weather))
                coords.Weather.Temperature = {};
            if ('Today' in coords.Weather.Temperature) {
                if (!('Separate' in coords.Weather.Temperature.Today))
                    delete coords.Weather.Temperature.Today;
                else if ('Day' in coords.Weather.Temperature.Today.Separate) {
                    delete coords.Weather.Temperature.Today.Separate.Day;
                    if (!('Night' in coords.Weather.Temperature.Today.Separate))
                        delete coords.Weather.Temperature.Today;
                } else {
                    coords.Weather.Temperature.Today.Separate.Day = {
                        Number: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 20,
                            BottomRightY: 10,
                            Alignment: "TopLeft",
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        },
                        MinusImageIndex: 217,
                        DegreesImageIndex: 218
                    }
                }
            } else {
                coords.Weather.Temperature.Today = {
                    Separate: {
                        Day: {
                            Number: {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 20,
                                BottomRightY: 10,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            },
                            MinusImageIndex: 217,
                            DegreesImageIndex: 218
                        }
                    }
                }
            }
            if (Object.keys(coords.Weather.Temperature).length == 0)
                delete coords.Weather.Temperature;
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgweathersepnight: function () {
            if (!('Weather' in coords))
                coords.Weather = {};
            if (!('Temperature' in coords.Weather))
                coords.Weather.Temperature = {};
            if ('Today' in coords.Weather.Temperature) {
                if (!('Separate' in coords.Weather.Temperature.Today))
                    delete coords.Weather.Temperature.Today;
                else if ('Night' in coords.Weather.Temperature.Today.Separate) {
                    delete coords.Weather.Temperature.Today.Separate.Night;
                    if (!('Day' in coords.Weather.Temperature.Today.Separate))
                        delete coords.Weather.Temperature.Today;
                } else {
                    coords.Weather.Temperature.Today.Separate.Night = {
                        Number: {
                            TopLeftX: 0,
                            TopLeftY: 0,
                            BottomRightX: 20,
                            BottomRightY: 10,
                            Alignment: "TopLeft",
                            Spacing: 2,
                            ImageIndex: 200,
                            ImagesCount: 10
                        },
                        MinusImageIndex: 217,
                        DegreesImageIndex: 218
                    }
                }
            } else {
                coords.Weather.Temperature.Today = {
                    Separate: {
                        Night: {
                            Number: {
                                TopLeftX: 0,
                                TopLeftY: 0,
                                BottomRightX: 20,
                                BottomRightY: 10,
                                Alignment: "TopLeft",
                                Spacing: 2,
                                ImageIndex: 200,
                                ImagesCount: 10
                            },
                            MinusImageIndex: 217,
                            DegreesImageIndex: 218
                        }
                    }
                }
            }
            if (Object.keys(coords.Weather.Temperature).length == 0)
                delete coords.Weather.Temperature;
            if (Object.keys(coords.Weather).length == 0)
                delete coords.Weather;
            this.updatecode();
            jsoneditor.select('"Temperature":');
        },
        tgstepsgoal: function () {
            if (!('StepsProgress' in coords))
                coords.StepsProgress = {};
            if ('GoalImage' in coords.StepsProgress)
                delete coords.StepsProgress.GoalImage;
            else
                coords.StepsProgress.GoalImage = {
                    X: 0,
                    Y: 0,
                    ImageIndex: 266
                }
            if (Object.keys(coords.StepsProgress).length == 0)
                delete coords.StepsProgress;
            this.updatecode();
            jsoneditor.select('"GoalImage":');
        },
        disablesec: function () {
            if ('AnalogDialFace' in coords)
                if ('Seconds' in coords.AnalogDialFace) {
                    coords.AnalogDialFace.Minutes.CenterImage = coords.AnalogDialFace.Seconds.CenterImage;
                    delete coords.AnalogDialFace.Seconds;
                    this.updatecode();
                }
        },
        select: function (s) {
            var target = this.findspan(s);
            if (!target) return 0;
            var rng, sel;
            rng = document.createRange();
            rng.selectNode(target.childNodes[0])
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(rng);
            $("codearea").scrollTop = target.offsetTop - 200;
        },
        findspan: function (s) {
            for (var i = 0; i < $("codearea").childNodes.length; i++)
                if ($("codearea").childNodes[i].tagName == 'SPAN')
                    if ($("codearea").childNodes[i].childNodes[0].data == s)
                        return $("codearea").childNodes[i];
        },
        fillarea: function () {
            if (!('editortabversion' in localStorage) || localStorage.editortabversion < data.app.editortabversion)
                localStorage.editortabversion = data.app.editortabversion;
            this.updatecode();
            if (data.firstopen_editor) {
                sessionStorage.firstopen_editor = false;
                UIkit.notification("To update preview just click out of JSON input", {
                    status: 'primary',
                    pos: 'top-left',
                    timeout: 3000
                });
                data.firstopen_editor = false;
            }
        },
        syntaxHighlight: function (json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        },
        exportjs: function () {
            if (data.app.edgeBrowser) {
                var blob = new Blob([JSON.stringify(coords, null, 4)], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, data.wfname + '.json');
            } else {
                var a = document.createElement('a');
                a.href = 'data:application/octet-stream;base64, ' + btoa(JSON.stringify(coords, null, 2));
                a.download = data.wfname + '.json';
                a.click();
            }
        },
        makepng: function () {
            var el = "watchfaceblock";
            if ($("makepngwithwatch").checked)
                el = "watchfaceimage";
            html2canvas($(el), {
                onrendered: function (canvas) {
                    ctx = canvas.getContext("2d");
                    if (data.app.edgeBrowser) {
                        canvas.toBlob(function (blob) {
                            saveAs(blob, data.wfname + ".png");
                        });
                    } else {
                        var a = document.createElement('a');
                        a.href = canvas.toDataURL("image/png");
                        a.download = data.wfname + '.png';
                        a.click();
                        delete a;
                    }
                }
            });
        },
        codeareablur: function () {
            try {
                coords = jsonlint.parse($("codearea").innerHTML.replace(this.regexr, ''));
                view.makeWf();
                $("codearea").innerHTML = jsoneditor.syntaxHighlight(JSON.stringify(coords, null, 4));
                if ($("codearea").innerHTML.replace(this.regexr, '').match(this.regexrimg))
                    $("defaultimages").classList.add("uk-label-success");
                else
                    $("defaultimages").classList.remove("uk-label-success");
            } catch (error) {
                $("jsonerrortext").innerHTML = error;

                function show() {
                    UIkit.modal($("jsonerrormodal")).show()
                }
                setTimeout(show, 250);
                console.warn(error);
            }
        },
        regexr: /<\/?\w*>|<\w*\s\w*="#[\w\d]{6}">|<([\w\s]*="[\s\w:(,);\-&.]*")*>/g,
        regexrimg: /"(Suffix|DecimalPoint|MinusSign|Degrees|Minus|)ImageIndex(On|Off|Am|Pm|)":\s2\d\d/g
    },
    imagestab = {
        init: function () {
            if (!('imagestabversion' in localStorage) || localStorage.imagestabversion < data.app.imagestabversion)
                localStorage.imagestabversion = data.app.imagestabversion;
            $("imagesinuse").innerHTML = '';
            $("imagesavalible").innerHTML = '';
            if ('Background' in coords)
                this.insertimg({
                    label: "Background"
                }, coords.Background.Image.ImageIndex);
            if ('Time' in coords) {
                this.insertimg({
                    label: "Time hours tens"
                }, coords.Time.Hours.Tens.ImageIndex, coords.Time.Hours.Tens.ImagesCount);
                this.insertimg({
                    label: "Time hours ones"
                }, coords.Time.Hours.Ones.ImageIndex, coords.Time.Hours.Ones.ImagesCount);
                this.insertimg({
                    label: "Time minutes tens"
                }, coords.Time.Minutes.Tens.ImageIndex, coords.Time.Minutes.Tens.ImagesCount);
                this.insertimg({
                    label: "Time minutes ones"
                }, coords.Time.Minutes.Ones.ImageIndex, coords.Time.Minutes.Ones.ImagesCount);
                if ('Seconds' in coords.Time) {
                    this.insertimg({
                        label: "Time seconds tens"
                    }, coords.Time.Seconds.Tens.ImageIndex, coords.Time.Seconds.Tens.ImagesCount);
                    this.insertimg({
                        label: "Time seconds ones"
                    }, coords.Time.Seconds.Ones.ImageIndex, coords.Time.Seconds.Ones.ImagesCount);
                }
                if ('AmPm' in coords.Time)
                    this.insertimg({
                        label: "Time am/pm"
                    }, coords.Time.AmPm.ImageIndexAm, 1, coords.Time.AmPm.ImageIndexPm);
            }
            if ('Date' in coords) {
                if ('WeekDay' in coords.Date) {
                    this.insertimg({
                        label: "Week day"
                    }, coords.Date.WeekDay.ImageIndex, coords.Date.WeekDay.ImagesCount);
                }
                if ('MonthAndDay' in coords.Date) {
                    if ('Separate' in coords.Date.MonthAndDay) {
                        if ('Day' in coords.Date.MonthAndDay.Separate) {
                            this.insertimg({
                                label: "Date day"
                            }, coords.Date.MonthAndDay.Separate.Day.ImageIndex, coords.Date.MonthAndDay.Separate.Day.ImagesCount);
                        }
                        if ('Month' in coords.Date.MonthAndDay.Separate) {
                            this.insertimg({
                                label: "Date month"
                            }, coords.Date.MonthAndDay.Separate.Month.ImageIndex, coords.Date.MonthAndDay.Separate.Month.ImagesCount);
                        }
                    }
                    if ('OneLine' in coords.Date.MonthAndDay) {
                        this.insertimg({
                            label: "Date oneline",
                            addition: (", " + coords.Date.MonthAndDay.OneLine.DelimiterImageIndex)
                        }, coords.Date.MonthAndDay.OneLine.Number.ImageIndex, coords.Date.MonthAndDay.OneLine.Number.ImagesCount, coords.Date.MonthAndDay.OneLine.DelimiterImageIndex);
                    }
                }
            }
            if ('Battery' in coords) {
                if ('Icon' in coords.Battery)
                    this.insertimg({
                        label: "Battery icon"
                    }, coords.Battery.Icon.ImageIndex, coords.Battery.Icon.ImagesCount);
                if ('Text' in coords.Battery)
                    this.insertimg({
                        label: "Battery text"
                    }, coords.Battery.Text.ImageIndex, coords.Battery.Text.ImagesCount);
                if ('Scale' in coords.Battery)
                    this.insertimg({
                        label: "Battery scale"
                    }, coords.Battery.Scale.StartImageIndex, coords.Battery.Scale.Segments.length);
            }
            if ('Status' in coords) {
                if ('Alarm' in coords.Status)
                    this.insertimg({
                        label: "Status alarm"
                    }, coords.Status.Alarm.ImageIndexOn, 1);
                if ('Bluetooth' in coords.Status)
                    this.insertimg({
                        label: "Status bluetooth",
                        addition: (", " + coords.Status.Bluetooth.ImageIndexOff)
                    }, coords.Status.Bluetooth.ImageIndexOn, 1, coords.Status.Bluetooth.ImageIndexOff);
                if ('DoNotDisturb' in coords.Status)
                    this.insertimg({
                        label: "Status do not disturb"
                    }, coords.Status.DoNotDisturb.ImageIndexOn, 1);
                if ('Lock' in coords.Status)
                    this.insertimg({
                        label: "Status lock"
                    }, coords.Status.Lock.ImageIndexOn, 1);
            }
            if ('Activity' in coords) {
                if ('Calories' in coords.Activity)
                    this.insertimg({
                        label: "Activity calories"
                    }, coords.Activity.Calories.ImageIndex, coords.Activity.Calories.ImagesCount);
                if ('Steps' in coords.Activity)
                    this.insertimg({
                        label: "Activity steps"
                    }, coords.Activity.Steps.ImageIndex, coords.Activity.Steps.ImagesCount);
                if ('StepsGoal' in coords.Activity)
                    this.insertimg({
                        label: "Activity steps goal"
                    }, coords.Activity.StepsGoal.ImageIndex, coords.Activity.StepsGoal.ImagesCount);
                if ('Pulse' in coords.Activity)
                    this.insertimg({
                        label: "Activity pulse"
                    }, coords.Activity.Pulse.ImageIndex, coords.Activity.Pulse.ImagesCount);
                if ('Distance' in coords.Activity)
                    this.insertimg({
                        label: "Activity distance",
                        addition: (", " + coords.Activity.Distance.DecimalPointImageIndex + ", " + coords.Activity.Distance.SuffixImageIndex)
                    }, coords.Activity.Distance.Number.ImageIndex, coords.Activity.Distance.Number.ImagesCount, coords.Activity.Distance.DecimalPointImageIndex, coords.Activity.Distance.SuffixImageIndex);
            }
            if ('Weather' in coords) {
                if ('Icon' in coords.Weather)
                    if ('CustomIcon' in coords.Weather.Icon) {
                        this.insertimg({
                            label: "Weather icons"
                        }, coords.Weather.Icon.CustomIcon.ImageIndex, coords.Weather.Icon.CustomIcon.ImagesCount);
                    }
                if ('Temperature' in coords.Weather) {
                    if ('Today' in coords.Weather.Temperature) {
                        if ('OneLine' in coords.Weather.Temperature.Today)
                            this.insertimg({
                                label: "Weather oneline",
                                addition: (", " + coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex + ", " + coords.Weather.Temperature.Today.OneLine.DelimiterImageIndex + ", " + coords.Weather.Temperature.Today.OneLine.DegreesImageIndex)
                            }, coords.Weather.Temperature.Today.OneLine.Number.ImageIndex, coords.Weather.Temperature.Today.OneLine.Number.ImagesCount, coords.Weather.Temperature.Today.OneLine.MinusSignImageIndex, coords.Weather.Temperature.Today.OneLine.DelimiterImageIndex, coords.Weather.Temperature.Today.OneLine.DegreesImageIndex);
                        if ('Separate' in coords.Weather.Temperature.Today) {
                            if ('Day' in coords.Weather.Temperature.Today.Separate)
                                this.insertimg({
                                    label: "Weather day",
                                    addition: (", " + coords.Weather.Temperature.Today.Separate.Day.MinusImageIndex)
                                }, coords.Weather.Temperature.Today.Separate.Day.Number.ImageIndex, coords.Weather.Temperature.Today.Separate.Day.Number.ImagesCount, coords.Weather.Temperature.Today.Separate.Day.MinusImageIndex);
                            if ('Night' in coords.Weather.Temperature.Today.Separate)
                                this.insertimg({
                                    label: "Weather night",
                                    addition: (", " + coords.Weather.Temperature.Today.Separate.Night.MinusImageIndex)
                                }, coords.Weather.Temperature.Today.Separate.Night.Number.ImageIndex, coords.Weather.Temperature.Today.Separate.Night.Number.ImagesCount, coords.Weather.Temperature.Today.Separate.Night.MinusImageIndex);
                        }
                    }
                    if ('Current' in coords.Weather.Temperature)
                        this.insertimg({
                            label: "Weather current",
                            addition: (", " + coords.Weather.Temperature.Current.MinusImageIndex + ", " + coords.Weather.Temperature.Current.DegreesImageIndex)
                        }, coords.Weather.Temperature.Current.Number.ImageIndex, coords.Weather.Temperature.Current.Number.ImagesCount, coords.Weather.Temperature.Current.MinusImageIndex, coords.Weather.Temperature.Current.DegreesImageIndex);
                }
                if ('AirPollution' in coords.Weather)
                    this.insertimg({
                        label: "Weather air pollution"
                    }, coords.Weather.AirPollution.Icon.ImageIndex, coords.Weather.AirPollution.Icon.ImagesCount);
            }
            if ('StepsProgress' in coords) {
                if ('Linear' in coords.StepsProgress)
                    this.insertimg({
                        label: "Steps progress"
                    }, coords.StepsProgress.Linear.StartImageIndex, coords.StepsProgress.Linear.Segments.length);
                if ('GoalImage' in coords.StepsProgress)
                    this.insertimg({
                        label: "Goal image"
                    }, coords.StepsProgress.GoalImage.ImageIndex, 1);
            }
            this.insertimg({
                label: "Big digits",
                insertto: "imagesavalible"
            }, 255, 10);
            this.insertimg({
                label: "Digits",
                insertto: "imagesavalible"
            }, 200, 10);
            this.insertimg({
                label: "Week days",
                insertto: "imagesavalible"
            }, 210, 7);
            this.insertimg({
                label: "Week days russian",
                insertto: "imagesavalible"
            }, 241, 7);
            this.insertimg({
                label: "Week days russian inverted",
                insertto: "imagesavalible"
            }, 248, 7);
            this.insertimg({
                label: "Battery icon",
                insertto: "imagesavalible"
            }, 225, 6);
            this.insertimg({
                label: "Air pollution",
                insertto: "imagesavalible"
            }, 235, 6);
            this.insertimg({
                label: "Weather symbols",
                insertto: "imagesavalible",
                addition: ", 218, 219"
            }, 217, 3);
            this.insertimg({
                label: "Bluetooth",
                insertto: "imagesavalible",
                addition: ", 221"
            }, 220, 2);
            this.insertimg({
                label: "Distance symbols",
                insertto: "imagesavalible",
                addition: ", 232"
            }, 231, 2);
            this.insertimg({
                label: "Am/Pm",
                insertto: "imagesavalible",
                addition: ", 234"
            }, 233, 2);
            this.insertimg({
                label: "Status images",
                insertto: "imagesavalible",
                addition: ", 223, 224"
            }, 222, 3);
            this.insertimg({
                label: "Steps goal image",
                insertto: "imagesavalible"
            }, 266, 1);
            this.insertimg({
                label: "Weather icons",
                insertto: "imagesavalible"
            }, 267, 26);
        },
        insertimg: function (name, imageindex, imagescount) {
            if (!('insertto' in name))
                name.insertto = "imagesinuse";
            if (!('addition' in name))
                name.addition = "";
            if (imagescount == undefined) imagescount = 1;
            if (imageindex == undefined) {
                imagescount = 0;
                imageindex = '';
                name.addition = name.addition.slice(2);
            }
            $(name.insertto).innerHTML += '<div class="imagessection"><div><span class="imagessection-h">' + name.label + '</span><span class="imagessection-description">ImageIndex: ' + imageindex + name.addition + '</span></div><div class="imagessection-images"></div></div>';
            if ((imageindex - imageindex % 100) / 100 == 2)
                $(name.insertto).lastChild.classList.add("imagessection-def");
            for (var i = 0; i < imagescount; i++) {
                $(name.insertto).lastChild.lastChild.appendChild($c(imageindex + i));
                $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
            }
            if (arguments.length > 3)
                for (var i = 3; i < arguments.length; i++) {
                    $(name.insertto).lastChild.lastChild.appendChild($c(arguments[i]));
                    $(name.insertto).lastChild.lastChild.lastChild.removeAttribute("id");
                }
        }
    };

init();
