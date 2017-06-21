var current_width, current_height, fault_to_location_line, fault_system_bbox_line, jmarkers = [],
    featureInfoArray = [],
    fault_mode_extent = [],
    place_is_visible = 0,
    all_layers = [];
var url1 = 'http://faultfinder.phivolcs.dost.gov.ph/ows/wms/active_fault_valley_fault_wms?',
    url2 = 'http://faultfinder.phivolcs.dost.gov.ph/ows/wms/active_fault_philippines_wms?';
all_layers[0] = [];
all_layers[1] = [];
all_layers[0][1] = {
    wms_0: "dummy",
    wms_1: "dummy"
};
all_layers[0][0] = {
    wms_0: "dummy",
    wms_1: "dummy"
};
all_layers[1][1] = {
    wms_0: "dummy",
    wms_1: "dummy"
};
all_layers[1][0] = {
    wms_0: "dummy",
    wms_1: "dummy"
};
fault_mode_extent[0] = [];
fault_mode_extent[0] = [121.035810738511, 14.1760396834254, 121.174804531732, 14.7984832558262];
fault_mode_extent[1] = [];
fault_mode_extent[1] = [119.910645322507, 5.63679220628661, 126.741429705194, 19.8673528180161];
fault_mode_extent[2] = [];
fault_mode_extent[2] = [119.910645322507, 5.63679220628661, 126.741429705194, 19.8673528180161];
var the_layers;
var up_down_arrow = new Array(2);
up_down_arrow[0] = new Image, up_down_arrow[1] = new Image, up_down_arrow[1].src = "data/arrow_down.png", up_down_arrow[0].src = "data/arrow_up.png";
var up_down_arrow_flag = 0,
    buttons_are_visible = 0,
    script_root_url, myfault_root_url = "myfault",
    host_name = "faultfinder.phivolcs.dost.gov.ph",
    map, ititial_location = new google.maps.LatLng(14.58, 121),
    jrand_no, fixed_button_width = 310,
    fixed_button_height = 35,
    fixed_button_title_width = 150;
var geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};
window.addEventListener("orientationchange", adjust_locations_sizes_views);
var scroll_li_id = [],
    place_id = [],
    jbScroll, main_place_div_height, clickTimerP = null,
    data_provinces = null,
    data_municities = null,
    data_barangays = null,
    places_names = null,
    place_level = 0,
    current_place = new Array(3);
current_place[0] = "Ambot", current_place[1] = "Ambot", current_place[2] = "Ambot";
var place_indices = new Array(4);
place_indices[0] = -1, place_indices[1] = -1, place_indices[2] = -1;
var old_place_indices = new Array(4);
old_place_indices[0] = -1, old_place_indices[1] = -1, old_place_indices[2] = -1;
var fault_latlong = new Array(3);
fault_latlong[0] = new Array(2), fault_latlong[1] = new Array(2), fault_latlong[2] = new Array(2);
var place_latlong = new Array(3);
place_latlong[0] = new Array(2), place_latlong[1] = new Array(2), place_latlong[2] = new Array(2);
var fault_scroll_li_id = [],
    fault_place_id = [],
    fault_jbScroll, main_fault_div_height, fault_place_is_visible = 0,
    fault_level = 0,
    gamay = 2,
    maku = 100,
    old_fault_mode = 1,
    fault_flag = 1;
fault_names = new Array(2);
fault_names[0] = null, fault_names[1] = null;
var current_fault = new Array(2);
current_fault[0] = "Ambot", current_fault[1] = "Ambot";
var fault_indices = new Array(2);
fault_indices[0] = -1, fault_indices[1] = -1;
var old_fault_indices = new Array(2);
old_fault_indices[0] = -1, old_fault_indices[1] = -1;
var myTimer, clickTimer = null;
var hangtud = 11;
var vstatuss = 0;
var map;
var popup = null;
var marker = null;
var vector_layer;
var line = null;
var rectangle = null;
var is_IE = 0;
var is_chrome = 0;
var base_maps = [];
var MaxZoom = 10;
var threshold_distance = 1500;
var is_mobile = 0;
var FAULT_MAP_MODE = 2;
var OLD_FAULT_MAP_MODE = -1;
var IS_HOME = 1;
var BaseLayer = 0;
var temporary_fault_mode = 0;
var just_starting_up = 1;
var fault_line_on_display = 0;
var warning_given = [];
warning_given[0] = 0;
warning_given[1] = 0;
warning_given[2] = 0;
var legend_images = [];
legend_images[0] = new Image();
legend_images[1] = new Image();
legend_images[0].src = "data/Legend1.JPG";
legend_images[1].src = "data/Legend2.jpg";
var basemap_menu_images = [];
basemap_menu_images[0] = new Image();
basemap_menu_images[1] = new Image();
basemap_menu_images[2] = new Image();
basemap_menu_images[0].src = "data/basemap_choice_0.png";
basemap_menu_images[1].src = "data/basemap_choice_1.png";
basemap_menu_images[2].src = "data/basemap_choice_2.png";
var intro_image = new Image();
intro_image.src = "data/ff_logo.png";
var hit_id;
var mobile_location_check_counter = 0;
var location_country;
var glatlong = null;
var location_timer;
var location_timer_time = 15000;
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': false,
        'double': true,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    initialize: function(a) {
        this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.handler = new OpenLayers.Handler.Click(this, {
            'click': this.onClick,
            'dblclick': this.onDblclick
        }, this.handlerOptions)
    },
    onClick: function(a) {},
    onDblclick: function(a) {
        var b = map.getLonLatFromPixel(a.xy);
        b.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
        get_that_fault_new(b.lat, b.lon);
        remove_bbox()
    }
});
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function determine_browser() {
    f();
    if (window.ActiveXObject) {
        is_IE = 1;
        window_content_portion_offset = 96;
        legend_box_size = 20
    } else if (document.implementation.createDocument) {
        is_IE = 0;
        window_content_portion_offset = 97;
        legend_box_size = 17
    }
    is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (is_chrome) {
        legend_box_size = 18
    }
}

function initialize_wms_variable() {
    all_layers[0][1].wms_0 = new OpenLayers.Layer.WMS('Valley Fault Namria', url1, {
        layers: 'active_fault_valley_fault',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[0][1].wms_1 = new OpenLayers.Layer.WMS('Valley Fault Google', url1, {
        layers: 'active_fault_valley_fault',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[0][0].wms_0 = new OpenLayers.Layer.WMS('Manila Mosaic Namria', 'http://202.90.128.73/ows/wms/manila_masaic_wms?', {
        layers: 'manila_mosaic',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[0][0].wms_1 = new OpenLayers.Layer.WMS('Manila Mosaic Google', 'http://202.90.128.73/ows/wms/manila_masaic_wms?', {
        layers: 'manila_mosaic',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[1][1].wms_0 = new OpenLayers.Layer.WMS('Philippines Fault Namria', url2, {
        layers: 'active_fault_philippines',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[1][1].wms_1 = new OpenLayers.Layer.WMS('Philippines Fault Google', url2, {
        layers: 'active_fault_philippines',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[1][0].wms_0 = new OpenLayers.Layer.WMS('Manila Mosaic Namria', 'http://202.90.128.73/ows/wms/manila_masaic_wms?', {
        layers: 'manila_mosaic',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    });
    all_layers[1][0].wms_1 = new OpenLayers.Layer.WMS('Manila Mosaic Google', 'http://202.90.128.73/ows/wms/manila_masaic_wms?', {
        layers: 'manila_mosaic',
        transparent: 'true',
        format: 'image/png'
    }, {
        isBaseLayer: false,
        reproject: false,
        opacity: 1,
        'wrapDateLine': true,
        displayInLayerSwitcher: false
    })
}

function the_values() {
    fault_flag = MyIntNum(gamay, maku);
    old_fault_mode = vstatus * fault_flag
}

function createRequestObject() {
    jrand_no = Math.ceil(100 * Math.random());
    if (jrand_no == 0) jrand_no = 1;
    var a;
    if (navigator.appName == "Microsoft Internet Explorer") {
        a = new ActiveXObject("Microsoft.XMLHTTP")
    } else {
        a = new XMLHttpRequest()
    }
    return a
}

function the_initialization() {
    determine_browser();
    if (this_is_mobile()) initialize_for_mobile();
    else initialize_for_pc();
    pila_kabuok()
}

function initialize_for_mobile() {
    window.scrollTo(0, 1);
    is_mobile = 1;
    var a = [3968.75793751588, 2645.83862501058, 1322.91931250529, 661.459656252646, 264.583862501058, 132.291931250529, 66.1459656252646, 26.4583862501058, 13.2291931250529, 6.61459656252646, 2.64583862501058, 1.32291931250529, 0.661459656252646];
    var b = new OpenLayers.Size(256, 256);
    var c = 'EPSG:900913';
    var d = new OpenLayers.LonLat(-20037508.342787, 20037508.342787);
    var e = new OpenLayers.Control.MousePosition();
    var f = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var g = "m";
    map = new OpenLayers.Map('map', {
        controls: [new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                interval: 0,
                enableKinetic: true
            }
        })],
        maxExtent: f,
        StartBounds: f,
        units: g,
        tileSize: b,
        projection: c,
        restrictedExtent: f,
        fallThrough: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        eventListeners: {
            "changebaselayer": mapBaseLayerChanged
        }
    });
    base_maps[0] = new OpenLayers.Layer.OSM("Simple OSM Map", "http://v2.geoportal.gov.ph/tiles/v2/PGP/${z}/${x}/${y}.png");
    base_maps[1] = new OpenLayers.Layer.Google("Google Map - Satellite", {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 22,
        sphericalMercator: true,
        transitionEffect: "resize",
        isBaseLayer: true,
        displayInLayerSwitcher: true,
        resolutions: a
    });
    base_maps[2] = new OpenLayers.Layer.OSM("Simple OSM Map");
    base_maps[3] = new OpenLayers.Layer.Google("Google Map - Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 22,
        sphericalMercator: true,
        transitionEffect: "resize",
        isBaseLayer: true,
        displayInLayerSwitcher: true,
        resolutions: a
    });
    var h = new OpenLayers.Control.Click();
    map.addControl(h);
    h.activate();
    map.addLayers([base_maps[3], base_maps[0], base_maps[1], base_maps[2]]);
    vector_layer = new OpenLayers.Layer.Vector("Overlay", {
        displayInLayerSwitcher: false
    });
    map.zoomToExtent(new OpenLayers.Bounds(fault_mode_extent[1]).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')));
    the_source();
    initialize_wms_variable();
    map.setBaseLayer(base_maps[3])
}

function initialize_for_pc() {
    window.scrollTo(0, 1);
    var a = [3968.75793751588, 2645.83862501058, 1322.91931250529, 661.459656252646, 264.583862501058, 132.291931250529, 66.1459656252646, 26.4583862501058, 13.2291931250529, 6.61459656252646, 2.64583862501058, 1.32291931250529, 0.661459656252646];
    var b = new OpenLayers.Size(256, 256);
    var c = 'EPSG:900913';
    var d = new OpenLayers.LonLat(-20037508.342787, 20037508.342787);
    var e = new OpenLayers.Control.MousePosition();
    var f = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var g = "m";
    map = new OpenLayers.Map('map', {
        controls: [],
        maxExtent: f,
        StartBounds: f,
        units: g,
        tileSize: b,
        projection: c,
        restrictedExtent: f,
        fallThrough: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        eventListeners: {
            "changebaselayer": mapBaseLayerChanged
        }
    });
    base_maps[0] = new OpenLayers.Layer.OSM("Simple OSM Map", "http://v2.geoportal.gov.ph/tiles/v2/PGP/${z}/${x}/${y}.png");
    base_maps[1] = new OpenLayers.Layer.Google("Google Map - Satellite", {
        type: google.maps.MapTypeId.HYBRID,
        numZoomLevels: 22,
        sphericalMercator: true,
        transitionEffect: "resize",
        isBaseLayer: true,
        displayInLayerSwitcher: true,
        resolutions: a
    });
    base_maps[2] = new OpenLayers.Layer.OSM("Simple OSM Map");
    base_maps[3] = new OpenLayers.Layer.Google("Google Map - Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        numZoomLevels: 22,
        sphericalMercator: true,
        transitionEffect: "resize",
        isBaseLayer: true,
        displayInLayerSwitcher: true,
        resolutions: a
    });
    var h = new OpenLayers.Control.Zoom();
    h.position = new OpenLayers.Pixel(7, 85);
    var i = new OpenLayers.Control.ZoomBox();
    var j = new OpenLayers.Control.Navigation();
    map.addControls([i, j, h]);
    j.activate();
    var k = new OpenLayers.Control.Click();
    map.addControl(k);
    k.activate();
    map.addLayers([base_maps[3], base_maps[0], base_maps[1], base_maps[2]]);
    vector_layer = new OpenLayers.Layer.Vector("Overlay", {
        displayInLayerSwitcher: false
    });
    map.zoomToExtent(new OpenLayers.Bounds(fault_mode_extent[1]).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')));
    the_source();
    initialize_wms_variable();
    map.setBaseLayer(base_maps[3])
}

function the_source() {
    url1 = 'http://' + host_name + '/ows/wms/serve/s_' + vstatus + '/wms_1_' + vstatuss;
    url2 = 'http://' + host_name + '/ows/wms/serve/s_' + vstatus + '/wms_2_' + vstatuss
}

function renew() {
    setTimeout("location.reload(true)", 3600 * hangtud * 1000)
}

function mapBaseLayerChanged(a) {
    if (just_starting_up) return;
    if (warning_given[2] == 1) return;
    alert("Note: We have observed some discrepancies by as much as 10 meters when using basemaps other than the Philippine Geoportal Basemap provided by NAMRIA. Therefore, users are advised to take the necessary precautions when viewing the active faults using other basemaps included in this app.");
    warning_given[2] = 1
}

function common_starts() {
    adjust_map_canvas();
    fault_mode_initial_zoom(1)
}

function this_is_mobile() {
    var a = ('DeviceOrientationEvent' in window || 'orientation' in window);
    if (/Windows NT|Macintosh|Mac OS X|Linux/i.test(navigator.userAgent)) a = false;
    if (/Mobile/i.test(navigator.userAgent)) a = true;
    return a
}

function delete_point_and_line() {
    deletePoints(), remove_fault_to_locaiton_line()
}

function geo_success(e) {
    glatlong = {
        lat: e.coords.latitude,
        lng: e.coords.longitude
    };
    clearTimeout(location_timer);
    get_that_fault(e);
    if (is_mobile) {
        if (mobile_location_check_counter == 0) {
            mobile_location_check_counter = 1;
            pila_kabuok_update(e)
        } else pila_kabuok_mobile(e)
    } else pila_kabuok_update(e)
}

function geo_error() {
    show_hide_first_wait(0)
}

function start_location_determination_timer() {
    location_timer = setTimeout(function() {
        if (!glatlong) show_hide_first_wait(0)
    }, location_timer_time)
}

function get_my_fault() {
    if ("visible" == document.getElementById("first_wait").style.visibility) return;
    if (navigator.geolocation) {
        show_hide_first_wait(1);
        delete_point_and_line();
        glatlong = null;
        start_location_determination_timer();
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options)
    } else alert("Your machine is not set to give location information!")
}

function get_that_fault_new(e, t) {
    if (IS_HOME) return;
    delete_point_and_line(), show_hide_first_wait(1), the_values();
    var a = script_root_url + "get_my_fault_new.php",
        l = t,
        _ = e,
        n = "?version=" + jrand_no + "&longitude=" + l + "&latitude=" + _ + "&fault_map_mode=" + FAULT_MAP_MODE + "&flag=" + fault_flag + "&old_fault_mode=" + old_fault_mode;
    i = createRequestObject();
    i.open("POST", a, true);
    i.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    i.setRequestHeader("Content-length", n.length);
    i.setRequestHeader("Connection", "close");
    i.onreadystatechange = function() {
        if (i.readyState == 4 && i.status == 200) {
            get_that_fault_final(i, e, t)
        }
    };
    i.send(n)
}

function get_that_fault(e) {
    the_values();
    var t = script_root_url + "get_my_fault_new.php",
        a = e.coords.longitude,
        l = e.coords.latitude,
        _ = "?version=" + jrand_no + "&longitude=" + a + "&latitude=" + l + "&fault_map_mode=" + FAULT_MAP_MODE + "&flag=" + fault_flag + "&old_fault_mode=" + old_fault_mode;
    n = createRequestObject();
    n.open("POST", t, true);
    n.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    n.setRequestHeader("Content-length", _.length);
    n.setRequestHeader("Connection", "close");
    n.onreadystatechange = function() {
        if (n.readyState == 4 && n.status == 200) {
            get_that_fault_final(n, l, a)
        }
    };
    n.send(_)
}

function get_that_fault_old(e) {
    var t = script_root_url + "get_my_fault_new.php",
        a = e.coords.longitude,
        l = e.coords.latitude,
        _ = t + "?version=" + jrand_no + "&longitude=" + a + "&latitude=" + l + "&fault_map_mode=" + FAULT_MAP_MODE,
        n = createRequestObject();
    n.open("GET", _), n.onreadystatechange = function() {
        get_that_fault_final(n, l, a)
    }, n.send(null)
}

function get_that_fault_final(e, t, a) {
    var l;
    if (4 == e.readyState) {
        if (l = e.responseText, show_hide_first_wait(0), -1 == l) return void alert("Can't get that damn fault");
        var _ = JSON.parse(l);
        var b = parseFloat(_.distance) / 1000;
        if (b > threshold_distance) {
            b = numberWithCommas(b.toFixed(0));
            alert("You are " + b + " km from the nearest Philippine active fault. Very far!");
            return
        }
        create_a_new_marker(_, t, a), draw_that_line(_, t, a)
    }
}

function draw_that_line(a, b, c) {
    remove_fault_to_locaiton_line();
    var d = parseFloat(a.latitude);
    var e = parseFloat(a.longitude);
    var f = {
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "butt"
    };
    var g = new OpenLayers.Geometry.Point(c, b).transform('EPSG:4326', 'EPSG:900913');
    var h = new OpenLayers.Geometry.Point(e, d).transform('EPSG:4326', 'EPSG:900913');
    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([g, h]), null, f);
    vector_layer.addFeatures(line);
    var i, miny, maxx, maxy;
    if (e < c) {
        i = e;
        maxx = c
    } else {
        i = c;
        maxx = e
    }
    if (d < b) {
        miny = d;
        maxy = b
    } else {
        miny = b;
        maxy = d
    }
    var j = new OpenLayers.Bounds(i, miny, maxx, maxy).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
    map.zoomToExtent(j);
    map.zoomTo(map.getZoom() - 1)
}

function create_a_new_marker(a, b, c) {
    deletePoints();
    var d = new OpenLayers.Geometry.Point(c, b).transform('EPSG:4326', 'EPSG:900913');
    marker = new OpenLayers.Feature.Vector(d, null, {
        externalGraphic: 'data/myicon.png',
        graphicHeight: 30,
        graphicWidth: 18,
        graphicXOffset: -9,
        graphicYOffset: -30
    });
    vector_layer.addFeatures(marker);
    attached_a_fault_info(a, b, c, 0)
}

function display_all_fault_layers() {
    for (i = 0; i < the_layers.length; i++) {
        if (BaseLayer == 0) {
            map.addLayers([the_layers[1].wms_0]);
            break
        } else {
            map.addLayers([the_layers[i].wms_1])
        }
    }
    map.addLayer(vector_layer)
}

function hide_all_layers() {
    for (i = 0; i < the_layers.length; i++) {
        if (BaseLayer == 0) {
            map.removeLayer(the_layers[1].wms_0);
            break
        } else {
            map.removeLayer(the_layers[i].wms_1)
        }
    }
    map.removeLayer(vector_layer)
}

function deletePoints() {
    if (marker != null) {
        marker.destroy();
        marker = null
    }
    if (popup != null) {
        popup.destroy();
        popup = null
    }
}

function remove_fault_to_locaiton_line() {
    if (line != null) {
        line.destroy();
        line = null
    }
}

function remove_bbox() {
    if (rectangle != null) {
        rectangle.destroy();
        rectangle = null
    }
}

function position_icons() {
    var a = document.getElementById("legend_icon").offsetWidth;
    var b = document.getElementById("legend_icon").offsetHeight;
    var c = document.getElementById("phivolcs").offsetHeight;
    var d = document.getElementById("gsj").offsetHeight;
    var e, pos_y_l, pos_y_p, pos_y_g;
    e = 5;
    pos_y_p = 5;
    document.getElementById("phivolcs").style.left = e + "px";
    document.getElementById("phivolcs").style.top = pos_y_p + "px";
    pos_y_g = pos_y_p + c + 5;
    document.getElementById("gsj").style.left = e + "px";
    document.getElementById("gsj").style.top = pos_y_g + "px";
    e = current_width - a - 5;
    if (is_mobile) pos_y_l = current_height - b - 16;
    else pos_y_l = current_height - b - 15;
    document.getElementById("legend_icon").style.left = e + "px";
    document.getElementById("legend_icon").style.top = pos_y_l + "px"
}

function position_basemap_button() {
    var a = document.getElementById("basemap_button").offsetWidth;
    var b = document.getElementById("basemap_button").offsetHeight;
    var c = current_width - a - 5;
    var d = 5;
    document.getElementById("basemap_button").style.left = c + "px";
    document.getElementById("basemap_button").style.top = d + "px";
    var a = document.getElementById("information").offsetWidth;
    var b = document.getElementById("information").offsetHeight;
    var e = current_width - a - 5;
    var f = d + b + 5;
    document.getElementById("information").style.left = e + "px";
    document.getElementById("information").style.top = f + "px"
}

function position_static_disclaimer() {
    var a = document.getElementById('static_disclaimer_0');
    var b = document.getElementById('static_disclaimer_1');
    var c = document.getElementById('static_disclaimer_0').value;
    var d = c.length * 12;
    document.getElementById("static_disclaimer_div").style.width = d + "px";
    var e = document.getElementById("static_disclaimer_div").offsetWidth;
    var f = document.getElementById("static_disclaimer_div").offsetHeight;
    var g = 10;
    var h = current_height - f - 25;
    a.style.textAlign = "left";
    b.style.textAlign = "left";
    if (is_mobile == 1) {
        g = (current_width - e) / 2;
        a.style.textAlign = "center";
        b.style.textAlign = "center"
    }
    document.getElementById("static_disclaimer_div").style.left = g + "px";
    document.getElementById("static_disclaimer_div").style.top = h + "px"
}

function position_legend() {
    var a = document.getElementById("legend_image").offsetWidth;
    var b = document.getElementById("legend_image").offsetHeight;
    var c, pos_y;
    if (is_mobile == 0) {
        c = current_width - a - 5;
        pos_y = current_height - b - 16;
        document.getElementById("legend_image").style.left = c + "px";
        document.getElementById("legend_image").style.top = pos_y + "px"
    } else center_a_div_vh("legend_image")
}

function center_guidelines() {
    var a = Math.round(window.innerWidth - 40);
    var b = Math.round(window.innerHeight * .75);
    document.getElementById("guideline_id").style.width = a + "px";
    document.getElementById("guideline_id").style.height = b + "px";
    center_a_div_vh("guideline_id");
    center_a_div_h("guideln_button");
    var c = window.innerHeight - document.getElementById("guideln_button").offsetWidth;
    document.getElementById("guideln_button").style.top = c + "px"
}

function show_hide_guideline(n) {
    if (n) {
        document.getElementById("guideline_id").style.visibility = "visible";
        document.getElementById("guideln_button").style.visibility = "visible";
        document.getElementById("information").style.visibility = "hidden"
    } else {
        document.getElementById("guideline_id").style.visibility = "hidden";
        document.getElementById("guideln_button").style.visibility = "hidden";
        document.getElementById("information").style.visibility = "visible"
    }
}

function center_a_div_h(e) {
    var t = document.getElementById(e).offsetWidth,
        a = window.innerWidth,
        l = (a - t) / 2;
    document.getElementById(e).style.left = l + "px"
}

function center_a_div_vh(e) {
    var t = document.getElementById(e).offsetWidth,
        a = document.getElementById(e).offsetHeight,
        l = window.innerWidth,
        _ = window.innerHeight,
        n = (l - t) / 2,
        i = (_ - a) / 2;
    document.getElementById(e).style.left = n + "px", document.getElementById(e).style.top = i + "px"
}

function center_main_buttons() {
    var a = 5;
    var b = document.getElementById("fault_finder_id").offsetHeight,
        wh = window.innerHeight;
    var c = wh / 2 - b + (b / 3),
        e = wh / 2 + b - (b / 3);
    var d = b * 3 + a * 2;
    var c = wh / 2 - d / 2;
    var e = c + b + a;
    var f = e + b + a;
    document.getElementById("fault_finder_id").style.top = c + "px";
    document.getElementById("valley_fault_choice").style.top = e + "px";
    document.getElementById("all_fault_choice").style.top = f + "px";
    center_a_div_h("fault_finder_id");
    center_a_div_h("valley_fault_choice");
    center_a_div_h("all_fault_choice")
}

function show_hide_main_buttons(n) {
    if (n) {
        document.getElementById("fault_finder_id").style.visibility = 'visible';
        document.getElementById("valley_fault_choice").style.visibility = 'visible';
        document.getElementById("all_fault_choice").style.visibility = 'visible';
        document.getElementById("up_down_arrow").style.visibility = 'hidden'
    } else {
        document.getElementById("fault_finder_id").style.visibility = 'hidden';
        document.getElementById("valley_fault_choice").style.visibility = 'hidden';
        document.getElementById("all_fault_choice").style.visibility = 'hidden';
        document.getElementById("up_down_arrow").style.visibility = 'visible'
    }
}

function adjust_locations_sizes_views() {
    adjust_map_canvas(), adjust_place_display_position(), adjust_fault_display_position(), adjust_buttons(), center_a_div_h("first_wait"), adjust_up_down_arrow(), center_main_buttons(), window.scrollTo(0, 1), center_disclaimer(), position_icons(), position_legend(), center_a_div_vh("about"), center_a_div_vh("myCanvas"), position_basemap_button(), center_a_div_vh("basemap_menu"), position_static_disclaimer(), center_guidelines()
}

function adjust_map_canvas() {
    current_width = window.innerWidth;
    current_height = window.innerHeight;
    window.scrollTo(0, 1);
    document.getElementById("map_canvas").style.width = current_width + "px";
    document.getElementById("map_canvas").style.height = current_height + "px"
}

function show_hide_first_wait(e) {
    document.getElementById("first_wait").style.visibility = e ? "visible" : "hidden"
}

function adjust_buttons() {
    var a = 5;
    var b = 6;
    var c = 1;
    var d = current_height - fixed_button_height - a;
    document.getElementById("home_button").style.width = fixed_button_width + "px";
    document.getElementById("home_button").style.top = d + "px";
    document.getElementById("home_button").style.left = c + "px";
    d = current_height - fixed_button_height * 2 - a - b;
    document.getElementById("our_faults_button").style.width = fixed_button_width + "px";
    document.getElementById("our_faults_button").style.top = d + "px";
    document.getElementById("our_faults_button").style.left = c + "px";
    d = current_height - fixed_button_height * 3 - a - b * 2;
    document.getElementById("on_places_button").style.width = fixed_button_width + "px";
    document.getElementById("on_places_button").style.top = d + "px";
    document.getElementById("on_places_button").style.left = c + "px";
    d = current_height - fixed_button_height * 4 - a - b * 3;
    document.getElementById("on_mylocation_button").style.width = fixed_button_width + "px";
    document.getElementById("on_mylocation_button").style.top = d + "px";
    document.getElementById("on_mylocation_button").style.left = c + "px";
    center_a_div_h("our_faults_button");
    center_a_div_h("on_places_button");
    center_a_div_h("on_mylocation_button");
    center_a_div_h("home_button")
}

function show_hide_buttons() {
    if ("visible" != document.getElementById("first_wait").style.visibility) {
        if (up_down_arrow_flag == 2) {
            up_down_arrow_flag = 0;
            show_hide_places(0);
            adjust_up_down_arrow();
            return
        }
        if (up_down_arrow_flag == 3) {
            up_down_arrow_flag = 0;
            show_hide_fault_names(0);
            adjust_up_down_arrow();
            return
        }
        if (!buttons_are_visible) {
            document.getElementById("on_places_button").style.visibility = 'visible';
            document.getElementById("on_mylocation_button").style.visibility = 'visible';
            document.getElementById("our_faults_button").style.visibility = 'visible';
            document.getElementById("home_button").style.visibility = 'visible';
            up_down_arrow_flag = 0;
            buttons_are_visible = 1
        } else {
            document.getElementById("on_places_button").style.visibility = 'hidden';
            document.getElementById("on_mylocation_button").style.visibility = 'hidden';
            document.getElementById("our_faults_button").style.visibility = 'hidden';
            document.getElementById("home_button").style.visibility = 'hidden';
            up_down_arrow_flag = 1;
            buttons_are_visible = 0
        }
        adjust_up_down_arrow()
    }
}

function adjust_up_down_arrow() {
    var a;
    var b;
    current_width = window.innerWidth;
    current_height = window.innerHeight;
    if (up_down_arrow_flag == 0) {
        b = 40;
        a = current_height - 195;
        document.getElementById("up_down_arrow").style.width = b + "px";
        document.getElementById("up_down_arrow").src = up_down_arrow[1].src
    }
    if (up_down_arrow_flag == 1) {
        b = 50;
        a = current_height - 50;
        document.getElementById("up_down_arrow").style.width = b + "px";
        document.getElementById("up_down_arrow").src = up_down_arrow[0].src
    }
    if (up_down_arrow_flag == 2) {
        b = 40;
        a = current_height - main_place_div_height - 75;
        document.getElementById("up_down_arrow").style.width = b + "px";
        document.getElementById("up_down_arrow").src = up_down_arrow[1].src
    }
    if (up_down_arrow_flag == 3) {
        b = 40;
        a = current_height - main_fault_div_height - 75;
        document.getElementById("up_down_arrow").style.width = b + "px";
        document.getElementById("up_down_arrow").src = up_down_arrow[1].src
    }
    var c = 1;
    document.getElementById("up_down_arrow").style.top = a + "px";
    center_a_div_h("up_down_arrow")
}

function center_disclaimer() {
    center_a_div_vh("disclaimer")
}

function reset_places_indices() {
    place_indices[place_level] = -1, old_place_indices[place_level] = -1, current_place[place_level] = "Ambot"
}

function create_those_places_list() {
    remove_place_elements(), create_all_place_elements(), adjust_place_display_position()
}

function load_place_scroll() {
    adjust_place_display_position(), jbScroll = new iScroll("jscroller")
}

function create_one_place_element(e) {
    var t, a = e,
        l = document.getElementById("main_place_list_id"),
        _ = document.createElement("li"),
        n = document.createElement("div"),
        i = document.createElement("input");
    t = "list_id" + a, scroll_li_id.push(t), list_item_div_id = "list_item_div_id" + a, t = "place_place_id" + a, place_id.push(t), _.setAttribute("id", scroll_li_id[a]), n.setAttribute("id", list_item_div_id), i.setAttribute("id", place_id[a]), i.setAttribute("type", "button"), l.appendChild(_), _.appendChild(n), n.appendChild(i);
    var o = document.getElementById(scroll_li_id[a]);
    o.className = "place_list_style";
    var s = document.getElementById(list_item_div_id);
    s.className = "place_list_item_div_class";
    var r = document.getElementById(place_id[a]);
    r.className = 0 != a ? "myButton_1" : "myButton_1_yellow", i.ontouchmove = function() {
        BlockMove(event)
    }, i.onclick = function() {
        choose_a_place(a), touchStartP()
    }, i.ondblclick = function() {
        forward_to_place()
    }, document.getElementById(place_id[a]).readOnly = !0, document.getElementById(place_id[a]).value = places_names[a].places
}

function touchStartP() {
    null == clickTimerP ? clickTimerP = setTimeout(function() {
        clickTimerP = null
    }, 500) : (clearTimeout(clickTimerP), clickTimerP = null, forward_to_place())
}

function create_all_place_elements() {
    var e;
    for (e = 0; e < places_names.length; e++) create_one_place_element(e);
    show_hide_places(1)
}

function remove_place_elements() {
    show_hide_places(0);
    for (var e = document.getElementById("main_place_list_id"); e.childNodes.length >= 1;) e.removeChild(e.firstChild);
    scroll_li_id.length = 0, place_id.length = 0
}

function adjust_place_display_position() {
    if (place_is_visible) {
        var e = (window.innerWidth, window.innerHeight),
            t = Math.round(e - e / 2),
            a = fixed_button_width;
        main_place_div_height = Math.round(e / 2);
        var l = fixed_button_width;
        for (i = 0; i < places_names.length; i++) document.getElementById(place_id[i]).style.width = l + "px";
        document.getElementById("main_place_div").style.width = a + "px", document.getElementById("main_place_div").style.height = main_place_div_height + "px", document.getElementById("main_place_div").style.top = t + "px", t -= 41, document.getElementById("title_buttons").style.top = t + "px", document.getElementById("title_buttons").style.width = a + "px", center_a_div_h("title_buttons"), center_a_div_h("main_place_div"), adjust_up_down_arrow()
    }
}

function applyClass(e, t) {
    var a = document.getElementById(e);
    a.className = t
}

function choose_a_place(e) {
    0 >= e || (reset_style(), place_indices[place_level] = e, null != place_id[e] && (applyClass(place_id[e], "myButton_purple"), old_place_indices[place_level] = e))
}

function reset_style() {
    var e = old_place_indices[place_level]; - 1 != e && null != place_id[e] && applyClass(place_id[e], "myButton_1")
}

function scroll_place() {
    var e = Math.floor(main_place_div_height / 27 / 2),
        t = current_place_index - e;
    0 >= t && (t = current_place_index);
    var a = "#" + scroll_li_id[t];
    jbScroll.scrollToElement(a), reset_style(), document.getElementById(place_id[current_place_index]).style.border = "2px solid red", old_place_index = current_place_index
}

function scroll_to_place() {
    adjust_place_display_position();
    var e = place_indices[place_level]; - 1 == e && (e = 0);
    var t = Math.floor(main_place_div_height / 38 / 2),
        a = e - t;
    0 >= a && (a = e);
    var l = "#" + scroll_li_id[a];
    jbScroll.scrollToElement(l)
}

function scroll_to_place_old() {
    adjust_place_display_position();
    var e = place_indices[place_level]; - 1 == e && (e = 0);
    var t = Math.floor(main_place_div_height / 38 / 2),
        a = e - t;
    0 >= a && (a = e);
    var l = "#" + scroll_li_id[a];
    jbScroll.scrollToElement(l)
}

function show_hide_places(e) {
    e ? (document.getElementById("title_buttons").style.visibility = "visible", document.getElementById("main_place_div").style.visibility = "visible", place_is_visible = 1, adjust_place_display_position()) : (document.getElementById("title_buttons").style.visibility = "hidden", document.getElementById("main_place_div").style.visibility = "hidden", place_is_visible = 0)
}

function forward_to_place() {
    if ("visible" != document.getElementById("first_wait").style.visibility && -1 != place_indices[place_level]) {
        var e, t = "dummy",
            a = place_indices[place_level],
            l = 0;
        switch (place_level) {
            case 0:
                if (null == data_provinces) {
                    l = 0;
                    break
                }
                if (document.getElementById("place_title_id").value = "Municipalities", e = document.getElementById(place_id[a]).value, e == current_place[place_level] && null != data_municities) {
                    l = 0, places_names = data_municities, place_level = 1, create_those_places_list();
                    var _ = place_indices[place_level];
                    choose_a_place(_)
                } else current_place[place_level] = e, place_level = 1, l = 1;
                break;
            case 1:
                if (null == data_municities) {
                    l = 0;
                    break
                }
                if (document.getElementById("place_title_id").value = "Barangays", e = document.getElementById(place_id[a]).value, t = current_place[place_level - 1], e == current_place[place_level] && null != data_barangays) {
                    l = 0, places_names = data_barangays, place_level = 2, create_those_places_list();
                    var _ = place_indices[place_level];
                    choose_a_place(_)
                } else current_place[place_level] = e, place_level = 2, l = 1;
                break;
            case 2:
                e = document.getElementById(place_id[a]).value, current_place[place_level] = e, show_hide_buttons(), get_the_nearest_place_from_fault(), l = 0
        }
        l && get_places_names(e, t)
    }
}

function backward_to_place() {
    if ("visible" != document.getElementById("first_wait").style.visibility && 0 != place_level) {
        place_level -= 1;
        var e = place_indices[place_level];
        switch (delete_point_and_line(), place_level) {
            case 0:
                document.getElementById("place_title_id").value = "Provinces", places_names = data_provinces, create_those_places_list(), choose_a_place(e);
                break;
            case 1:
                document.getElementById("place_title_id").value = "Municipalities", places_names = data_municities, create_those_places_list(), choose_a_place(e)
        }
    }
}

function start_places() {
    if ("visible" != document.getElementById("first_wait").style.visibility) {
        if (delete_point_and_line(), remove_bbox(), up_down_arrow_flag = 2, 0 != place_level || null != data_provinces) return void show_hide_places(1);
        document.getElementById("place_title_id").value = "Provinces";
        var e = "Philippines",
            t = "Dummy";
        get_places_names(e, t)
    }
}

function get_places_names(e, t) {
    show_hide_first_wait(1);
    var a = script_root_url + "get_my_place_names.php",
        l = a + "?version=" + jrand_no + "&place_level=" + place_level + "&place_name=" + e + "&place_name1=" + t + "&fault_map_mode=" + FAULT_MAP_MODE,
        _ = createRequestObject();
    _.open("GET", l), _.onreadystatechange = function() {
        get_places_names_final(_)
    }, _.send(null)
}

function get_places_names_final(e) {
    var t;
    if (4 == e.readyState) {
        if (show_hide_first_wait(0), t = e.responseText, -1 == t) return void alert("Can't get those places names!");
        places_names = JSON.parse(t), reset_places_indices(), show_places()
    }
}

function show_places() {
    switch (place_is_visible = 1, create_those_places_list(), place_level) {
        case 0:
            data_provinces = places_names;
            break;
        case 1:
            data_municities = places_names;
            break;
        case 2:
            data_barangays = places_names
    }
}

function get_the_nearest_place_from_fault() {
    show_hide_first_wait(1), delete_point_and_line(), the_values();
    var e = script_root_url + "get_my_place_geom_new.php",
        t = "?version=" + jrand_no + "&place_level=" + place_level + "&place_name0=" + current_place[0] + "&place_name1=" + current_place[1] + "&place_name2=" + current_place[2] + "&fault_map_mode=" + FAULT_MAP_MODE + "&flag=" + fault_flag + "&old_fault_mode=" + old_fault_mode;
    a = createRequestObject();
    a.open("POST", e, true);
    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    a.setRequestHeader("Content-length", t.length);
    a.setRequestHeader("Connection", "close");
    a.onreadystatechange = function() {
        if (a.readyState == 4 && a.status == 200) {
            get_the_nearest_place_from_fault_final(a)
        }
    };
    a.send(t)
}

function get_the_nearest_place_from_fault_old() {
    show_hide_first_wait(1), delete_point_and_line();
    var e = script_root_url + "get_my_place_geom_new.php",
        t = e + "?version=" + jrand_no + "&place_level=" + place_level + "&place_name0=" + current_place[0] + "&place_name1=" + current_place[1] + "&place_name2=" + current_place[2] + "&fault_map_mode=" + FAULT_MAP_MODE,
        a = createRequestObject();
    a.open("GET", t), a.onreadystatechange = function() {
        get_the_nearest_place_from_fault_final(a)
    }, a.send(null)
}

function get_the_nearest_place_from_fault_final(e) {
    var t;
    if (4 == e.readyState) {
        if (t = e.responseText, show_hide_first_wait(0), -1 == t) return void alert("Can't get that damn fault");
        var a = JSON.parse(t);
        create_a_new_place_marker(a), draw_that_place_to_fault_line(a)
    }
}

function create_a_new_place_marker(e) {
    deletePoints();
    var a = parseFloat(e.place_longitude),
        lat = parseFloat(e.place_latitude);
    var b = new OpenLayers.Geometry.Point(a, lat).transform('EPSG:4326', 'EPSG:900913');
    marker = new OpenLayers.Feature.Vector(b, null, {
        externalGraphic: 'data/myicon.png',
        graphicHeight: 30,
        graphicWidth: 18,
        graphicXOffset: -9,
        graphicYOffset: -30
    });
    vector_layer.addFeatures(marker);
    attached_a_fault_info(e, lat, a, 1)
}

function attached_a_fault_info(a, b, c, n) {
    var d;
    var e = parseFloat(a.distance);
    if (e / 1000 < 1) d = e.toFixed(0) + " m";
    else {
        e = e / 1000;
        d = e.toFixed(1) + " km"
    }
    var f = "<span class='marker_text_0'> " + a.the_place_name + "</span><br>";
    var g = "<span class='marker_text_0'>Nearest Active Fault Trace:</span><span class='marker_text_3'> " + d + "</span><br>";
    var h = "<span class='marker_text_1'>Fault Name:</span><span class='marker_text_2'> " + a.the_fault_name + "</span><br>";
    var i = "<span class='marker_text_1'>Segment Name:</span><span class='marker_text_2'> " + a.the_seg_name + "</span><br>";
    var j = "<span class='marker_text_1'>Year Mapped:</span><span class='marker_text_2'> " + a.year_mapped + "</span><br>";
    var k = "<span class='marker_text_1'>Mapping Scale Used:</span><span class='marker_text_2'> " + a.scale + "</span>";
    if (!n) var l = g + h + i + j + k;
    else var l = f + g + h + i + j + k;
    popup = new OpenLayers.Popup.FramedCloud("chicken", new OpenLayers.LonLat(c, b).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), null, l, null, true);
    popup.autoSize = true;
    map.addPopup(popup)
}

function draw_that_place_to_fault_line(e) {
    remove_fault_to_locaiton_line();
    var a = parseFloat(e.fault_latitude),
        lon1 = parseFloat(e.fault_longitude),
        lat2 = parseFloat(e.place_latitude),
        lon2 = parseFloat(e.place_longitude);
    var b = {
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "butt"
    };
    var c = new OpenLayers.Geometry.Point(lon1, a).transform('EPSG:4326', 'EPSG:900913');
    var d = new OpenLayers.Geometry.Point(lon2, lat2).transform('EPSG:4326', 'EPSG:900913');
    line = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([c, d]), null, b);
    vector_layer.addFeatures(line);
    var f, miny, maxx, maxy;
    if (lon1 < lon2) {
        f = lon1;
        maxx = lon2
    } else {
        f = lon2;
        maxx = lon1
    }
    if (a < lat2) {
        miny = a;
        maxy = lat2
    } else {
        miny = lat2;
        maxy = a
    }
    var g = new OpenLayers.Bounds(f, miny, maxx, maxy).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
    map.zoomToExtent(g);
    map.zoomTo(map.getZoom() - 1)
}

function show_hide_fault_names(e) {
    e ? (document.getElementById("fault_title_buttons").style.visibility = "visible", document.getElementById("main_fault_name_div").style.visibility = "visible", fault_place_is_visible = 1, adjust_fault_display_position()) : (document.getElementById("fault_title_buttons").style.visibility = "hidden", document.getElementById("main_fault_name_div").style.visibility = "hidden", fault_place_is_visible = 0)
}

function start_fault_names() {
    if ("visible" != document.getElementById("first_wait").style.visibility) {
        delete_point_and_line();
        up_down_arrow_flag = 3;
        if (fault_names[fault_level] != null) {
            show_hide_fault_names(1);
            return
        }
        var a = "Dummy";
        get_fault_names(a)
    }
}

function get_fault_names(e) {
    show_hide_first_wait(1);
    var t = script_root_url + "get_my_fault_names.php",
        a = t + "?version=" + jrand_no + "&fault_level=" + fault_level + "&fault_group_name=" + e + "&fault_map_mode=" + FAULT_MAP_MODE,
        l = createRequestObject();
    l.open("GET", a), l.onreadystatechange = function() {
        get_fault_names_final(l)
    }, l.send(null)
}

function get_fault_names_final(a) {
    var b;
    if (a.readyState == 4) {
        show_hide_first_wait(0);
        b = a.responseText;
        if (b == -1) {
            alert("Can't get those fault names!");
            return
        } else {
            fault_names[fault_level] = JSON.parse(b);
            reset_fault_related_indices();
            show_fault_names();
            if (FAULT_MAP_MODE == 0 && fault_level == 0) {
                choose_a_fault(1);
                forward_to_fault()
            }
        }
    }
}

function reset_fault_related_indices() {
    fault_indices[fault_level] = -1, old_fault_indices[fault_level] = -1, current_fault[fault_level] = "Ambot"
}

function show_fault_names() {
    create_those_fault_list(), fault_place_is_visible = 1
}

function create_those_fault_list() {
    remove_fault_elements(), create_all_fault_elements(), adjust_fault_display_position()
}

function load_fault_scroll() {
    adjust_fault_display_position(), fault_jbScroll = new iScroll("j_fault_scroller")
}

function create_one_fault_element(e) {
    var t, a = e,
        l = document.getElementById("main_fault_name_list_id"),
        _ = document.createElement("li"),
        n = document.createElement("div"),
        i = document.createElement("input");
    t = "fault_list_id" + a, fault_scroll_li_id.push(t), fault_list_item_div_id = "fault_list_item_div_id" + a, t = "fault_place_place_id" + a, fault_place_id.push(t), _.setAttribute("id", fault_scroll_li_id[a]), n.setAttribute("id", fault_list_item_div_id), i.setAttribute("id", fault_place_id[a]), i.setAttribute("type", "button"), l.appendChild(_), _.appendChild(n), n.appendChild(i);
    var o = document.getElementById(fault_scroll_li_id[a]);
    o.className = "fault_place_list_style";
    var s = document.getElementById(fault_list_item_div_id);
    s.className = "place_list_item_div_class";
    var r = document.getElementById(fault_place_id[a]);
    r.className = 0 == a ? "myButton_1_yellow" : "myButton_1", i.ontouchmove = function() {
        BlockMove(event)
    }, i.onclick = function() {
        choose_a_fault(a), touchStart()
    }, i.ondblclick = function() {
        forward_to_fault()
    }, document.getElementById(fault_place_id[a]).readOnly = !0, document.getElementById(fault_place_id[a]).value = fault_names[fault_level][a].the_fault_name
}

function touchStart() {
    null == clickTimer ? clickTimer = setTimeout(function() {
        clickTimer = null
    }, 500) : (clearTimeout(clickTimer), clickTimer = null, forward_to_fault())
}

function create_all_fault_elements() {
    var e;
    for (e = 0; e < fault_names[fault_level].length; e++) create_one_fault_element(e);
    show_hide_fault_names(1)
}

function remove_fault_elements() {
    show_hide_fault_names(0);
    for (var e = document.getElementById("main_fault_name_list_id"); e.childNodes.length >= 1;) e.removeChild(e.firstChild);
    fault_scroll_li_id.length = 0, fault_place_id.length = 0
}

function adjust_fault_display_position() {
    if (fault_place_is_visible && null != fault_names[fault_level]) {
        var e = (window.innerWidth, window.innerHeight),
            t = Math.round(e - e / 2),
            a = fixed_button_width;
        main_fault_div_height = Math.round(e / 2);
        var l = fixed_button_width;
        for (i = 0; i < fault_names[fault_level].length; i++) document.getElementById(fault_place_id[i]).style.width = l + "px";
        document.getElementById("main_fault_name_div").style.width = a + "px", document.getElementById("main_fault_name_div").style.height = main_fault_div_height + "px", document.getElementById("main_fault_name_div").style.top = t + "px", t -= 41, document.getElementById("fault_title_buttons").style.top = t + "px", document.getElementById("fault_title_buttons").style.width = a + "px", center_a_div_h("fault_title_buttons"), center_a_div_h("main_fault_name_div"), adjust_up_down_arrow()
    }
}

function choose_a_fault_comp(e) {
    0 >= e || (reset_fault_style(), fault_indices[fault_level] = e, null != fault_place_id[e] && (applyClass(fault_place_id[e], "myButton_purple"), old_fault_indices[fault_level] = e))
}

function choose_a_fault(a) {
    if (a <= 0) return;
    reset_fault_style();
    fault_indices[fault_level] = a;
    if (fault_place_id[a] == null) return;
    applyClass(fault_place_id[a], "myButton_purple");
    old_fault_indices[fault_level] = a
}

function reset_fault_style() {
    var e = old_fault_indices[fault_level]; - 1 != e && null != fault_place_id[e] && applyClass(fault_place_id[e], "myButton_1")
}

function scroll_to_fault() {
    adjust_fault_display_position();
    var e = fault_indices[fault_level]; - 1 == e && (e = 0);
    var t = Math.floor(main_fault_div_height / 38 / 2),
        a = e - t;
    0 >= a && (a = e);
    var l = "#" + fault_scroll_li_id[a];
    fault_jbScroll.scrollToElement(l)
}

function forward_to_fault() {
    if ("visible" != document.getElementById("first_wait").style.visibility && -1 != fault_indices[fault_level]) {
        var e, t = fault_indices[fault_level],
            a = 0;
        switch (fault_level) {
            case 0:
                draw_fault_system_bbox(fault_names[fault_level][t].the_bbox), e = document.getElementById(fault_place_id[t]).value, document.getElementById("fault_place_title_id").value = "Segments", e == current_fault[fault_level] ? (a = 0, fault_level = 1, create_those_fault_list(), t = fault_indices[fault_level], choose_a_fault(t)) : (current_fault[fault_level] = e, fault_level = 1, a = 1);
                break;
            case 1:
                var l = fault_names[fault_level][t].gid;
                get_the_selected_fault(l), show_hide_buttons(), a = 0, remove_bbox()
        }
        a && get_fault_names(e)
    }
}

function draw_fault_system_bbox(a) {
    remove_bbox();
    var b = a.split(",");
    var c = parseFloat(b[0]);
    var d = parseFloat(b[1]);
    var e = parseFloat(b[2]);
    var f = parseFloat(b[3]);
    var g = new OpenLayers.Bounds(c, d, e, f).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));
    var h = [new OpenLayers.Geometry.Point(g.left, g.top), new OpenLayers.Geometry.Point(g.right, g.top), new OpenLayers.Geometry.Point(g.right, g.bottom), new OpenLayers.Geometry.Point(g.left, g.bottom)];
    var i = new OpenLayers.Geometry.LinearRing(h);
    var j = new OpenLayers.Geometry.Polygon([i]);
    var k = {
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        fillColor: "#00FF00",
        fillOpacity: 0
    };
    rectangle = new OpenLayers.Feature.Vector(j, null, k);
    vector_layer.addFeatures(rectangle);
    map.zoomToExtent(g)
}

function hide_fault_names() {
    show_hide_buttons(), clearTimeout(myTimer)
}

function backward_to_fault() {
    if ("visible" != document.getElementById("first_wait").style.visibility && 0 != fault_level) {
        fault_level = 0, document.getElementById("fault_place_title_id").value = "The Faults";
        var e = fault_indices[fault_level];
        create_those_fault_list(), choose_a_fault(e), scroll_to_fault(), remove_bbox()
    }
}

function get_the_selected_fault(e) {
    show_hide_first_wait(1), delete_point_and_line();
    var t = script_root_url + "get_the_selected_fault.php",
        a = t + "?version=" + jrand_no + "&the_gid=" + e + "&fault_map_mode=" + FAULT_MAP_MODE,
        l = createRequestObject();
    l.open("GET", a), l.onreadystatechange = function() {
        get_the_selected_fault_final(l)
    }, l.send(null)
}

function get_the_selected_fault_final(e) {
    var t;
    if (4 == e.readyState) {
        if (t = e.responseText, show_hide_first_wait(0), -1 == t) return void alert("Can't get that damn fault");
        var a = JSON.parse(t);
        create_a_selected_fault_marker(a);
        show_hide_buttons()
    }
}

function create_a_selected_fault_marker(a) {
    deletePoints();
    var b = parseFloat(a.fault_longitude);
    var c = parseFloat(a.fault_latitude);
    var d = new OpenLayers.Geometry.Point(b, c).transform('EPSG:4326', 'EPSG:900913');
    marker = new OpenLayers.Feature.Vector(d, null, {
        externalGraphic: 'data/myicon.png',
        graphicHeight: 30,
        graphicWidth: 18,
        graphicXOffset: -9,
        graphicYOffset: -30
    });
    vector_layer.addFeatures(marker);
    var e = new OpenLayers.LonLat(b, c).transform('EPSG:4326', 'EPSG:900913');
    map.panTo(e);
    attached_a_selected_fault_info(a)
}

function attached_a_selected_fault_info(a) {
    var b = parseFloat(a.fault_longitude);
    var c = parseFloat(a.fault_latitude);
    var d = parseFloat(a.fault_length) / 1000;
    var e = "<span class='marker_text_0'>Fault Name:</span><span class='marker_text_2'> " + a.the_fault_name + "</span><br>";
    var f = "<span class='marker_text_1'>Segment Name:</span><span class='marker_text_2'> " + a.the_seg_name + "</span><br>";
    var g = "<span class='marker_text_1'>Trace Type:</span><span class='marker_text_2'> " + a.the_trace_type + "</span><br>";
    var h = "<span class='marker_text_1'>Line Type:</span><span class='marker_text_2'> " + a.the_line_type + "</span><br>";
    var i = "<span class='marker_text_1'>Center Longitude:</span><span class='marker_text_2'> " + b.toFixed(1) + "</span><br>";
    var j = "<span class='marker_text_1'>Center Latitude:</span><span class='marker_text_2'> " + c.toFixed(1) + "</span><br>";
    var k;
    if (d < 1) {
        d = d * 1000;
        k = "<span class='marker_text_1'>Fault Length (m):</span><span class='marker_text_2'> " + d.toFixed(0) + "</span>"
    } else k = "<span class='marker_text_1'>Fault Length (km):</span><span class='marker_text_2'> " + d.toFixed(1) + "</span>";
    message = e + f + g + h + i + j + k;
    popup = new OpenLayers.Popup.FramedCloud("chicken", new OpenLayers.LonLat(b, c).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), null, message, null, true);
    popup.autoSize = true;
    map.addPopup(popup)
}

function resolve() {
    script_root_url = "http://" + host_name + "/mysystem/" + myfault_root_url + "/scripts/"
}

function pila_kabuok_old() {
    var e = createRequestObject(),
        t = script_root_url + "hit_counter_latest.php?version=" + jrand_no;
    e.open("GET", t), e.send(null)
}

function go_home() {
    clearTimeout(location_timer);
    show_hide_first_wait(0);
    show_hide_buttons();
    show_hide_main_buttons(1);
    deletePoints();
    remove_fault_to_locaiton_line();
    remove_bbox();
    hide_all_layers();
    fault_mode_initial_zoom(1);
    IS_HOME = 1;
    OLD_FAULT_MAP_MODE = FAULT_MAP_MODE;
    fault_line_on_display = 0;
    document.getElementById("static_disclaimer_div").style.visibility = "visible";
    document.getElementById("legend_icon").style.visibility = 'hidden'
}

function change_fault_data(n) {
    document.getElementById("legend_image").src = legend_images[n].src;
    if (warning_given[n] == 0) {
        temporary_fault_mode = n;
        show_hide_desclaimer(1);
        return
    }
    if (is_mobile) document.getElementById("static_disclaimer_div").style.visibility = "hidden";
    document.getElementById("legend_icon").style.visibility = 'visible';
    FAULT_MAP_MODE = n;
    reset_fault_list();
    reset_places_list();
    change_the_button_text();
    the_layers = all_layers[FAULT_MAP_MODE];
    show_hide_buttons();
    show_hide_main_buttons(0);
    display_all_fault_layers();
    fault_mode_initial_zoom(n);
    IS_HOME = 0;
    fault_line_on_display = 1
}

function fault_mode_initial_zoom(a) {
    map.zoomToExtent(new OpenLayers.Bounds(fault_mode_extent[a]).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913')))
}

function reset_fault_list() {
    if (fault_names[fault_level] != null && OLD_FAULT_MAP_MODE == FAULT_MAP_MODE) return;
    fault_level = 0;
    remove_fault_elements();
    fault_names[0] = null;
    fault_names[1] = null;
    current_fault[0] = "Ambot";
    current_fault[1] = "Ambot";
    fault_indices[0] = -1, fault_indices[1] = -1;
    old_fault_indices[0] = -1, old_fault_indices[1] = -1;
    document.getElementById("fault_place_title_id").value = "The Faults";
    fault_place_is_visible = 0
}

function reset_places_list() {
    if (place_level != 0 || data_provinces != null) {
        if (OLD_FAULT_MAP_MODE == FAULT_MAP_MODE) return
    }
    place_level = 0;
    remove_place_elements();
    data_provinces = null, data_municities = null, data_barangays = null, places_names = null;
    current_place[0] = "Ambot", current_place[1] = "Ambot", current_place[2] = "Ambot";
    place_indices[0] = -1, place_indices[1] = -1, place_indices[2] = -1, place_indices[3] = -1;
    old_place_indices[0] = -1, old_place_indices[1] = -1, old_place_indices[2] = -1, old_place_indices[3] = -1;
    document.getElementById("place_title_id").value = "Provinces";
    place_is_visible = 0
}

function change_the_button_text() {
    if (FAULT_MAP_MODE == 0) {
        document.getElementById("on_mylocation_button").value = "VFS Fault Nearest You";
        document.getElementById("on_places_button").value = "Active Fault Based on Location"
    } else {
        document.getElementById("on_mylocation_button").value = "Active Fault Nearest You";
        document.getElementById("on_places_button").value = "Active Fault Based on Location"
    }
    if (is_mobile) document.getElementById("our_faults_button").value = "Double Tap a Place on the Map";
    else document.getElementById("our_faults_button").value = "Double Click a Place on the Map"
}

function show_hide_desclaimer(n) {
    if (n) document.getElementById("disclaimer").style.visibility = 'visible';
    else document.getElementById("disclaimer").style.visibility = 'hidden'
}

function agree_cancel(n) {
    if (n) {
        warning_given[temporary_fault_mode] = 1;
        change_fault_data(temporary_fault_mode)
    }
    show_hide_desclaimer(0)
}

function show_hide_legend(n) {
    if (n) {
        if (fault_line_on_display == 0) return;
        document.getElementById("legend_image").style.visibility = 'visible'
    } else document.getElementById("legend_image").style.visibility = 'hidden'
}

function show_hide_about(n) {
    if (n) document.getElementById("about").style.visibility = 'visible';
    else document.getElementById("about").style.visibility = 'hidden'
}
var IntervalTimer;
var IntervalDelay = 100;
var blink_counter = 0;
var flag = 0;
var c;
var ctx;
var opacity = 1.0;
var transparency = 0.0;
var canvas;
var the_map = document.getElementById("map");
var intro_counter = 0;

function start_canvas() {
    canvas = document.getElementById("myCanvas");
    canvas.style.visibility = 'visible';
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    ctx.drawImage(intro_image, 0, 0, canvas.width, canvas.height);
    IntervalTimer = setInterval(start_canvas_final, 2000)
}

function start_canvas_final() {
    map.setBaseLayer(base_maps[1]);
    clearInterval(IntervalTimer);
    IntervalTimer = setInterval(start_canvas_final_0, 1000)
}

function start_canvas_final_0() {
    common_starts();
    map.setBaseLayer(base_maps[0]);
    clearInterval(IntervalTimer);
    IntervalTimer = setInterval(start_canvas_final_1, 10)
}

function start_canvas_final_1() {
    clearInterval(IntervalTimer);
    IntervalTimer = setInterval(draw_canvas_image, IntervalDelay)
}

function draw_canvas_image() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    opacity = opacity - 0.05;
    ctx.globalAlpha = opacity;
    ctx.drawImage(intro_image, 0, 0, canvas.width, canvas.height);
    transparency = transparency + 0.05;
    the_map.style.opacity = transparency;
    if (opacity <= 0) {
        the_map.style.opacity = 1, clearInterval(IntervalTimer), document.getElementById("myCanvas").style.visibility = 'hidden', show_everything(), start_blinking(), just_starting_up = 0
    }
}

function show_everything() {
    show_hide_main_buttons(1);
    document.getElementById("gsj").style.visibility = 'visible';
    document.getElementById("phivolcs").style.visibility = 'visible';
    document.getElementById("basemap_button").style.visibility = "visible";
    document.getElementById("static_disclaimer_div").style.visibility = "visible";
    document.getElementById("information").style.visibility = "visible"
}

function start_blinking() {
    IntervalTimer = setInterval(the_blinking, IntervalDelay)
}

function the_blinking() {
    if (flag == 0) {
        document.getElementById("fault_finder_id").style.color = 'red';
        flag = 1
    } else {
        document.getElementById("fault_finder_id").style.color = '#00ffff';
        flag = 0
    }
    blink_counter++;
    if (blink_counter > 6) {
        clearInterval(IntervalTimer), document.getElementById("fault_finder_id").style.color = '#00ffff'
    }
}

function pila_kabuok() {
    var a = script_root_url + "hit_info_recorder.php?version=" + jrand_no + "&is_mobile=" + is_mobile;
    var b = createRequestObject();
    b.open("GET", a);
    b.onreadystatechange = function() {
        pila_kabuok_final(b)
    };
    b.send(null)
}

function pila_kabuok_mobile(l) {
    var a = l.coords.longitude;
    var b = l.coords.latitude;
    var c = script_root_url + "hit_info_recorder_mobile.php?version=" + jrand_no + "&longitude=" + a + "&latitude=" + b + "&country=" + location_country;
    var d = createRequestObject();
    d.open("GET", c);
    d.onreadystatechange = function() {
        pila_kabuok_final(d)
    };
    d.send(null)
}

function pila_kabuok_final(a) {
    var b;
    if (a.readyState == 4) {
        b = a.responseText;
        the_result = b.split(",");
        hit_id = the_result[0];
        location_country = the_result[1]
    }
}

function pila_kabuok_update(l) {
    var a = l.coords.longitude;
    var b = l.coords.latitude;
    var e = createRequestObject(),
        t = script_root_url + "hit_info_recorder_update.php?version=" + jrand_no + "&longitude=" + a + "&latitude=" + b + "&hit_id=" + hit_id;
    e.open("GET", t), e.send(null)
}

function choose_basemap(n) {
    map.setBaseLayer(base_maps[n]);
    document.getElementById("basemap_menu").src = basemap_menu_images[n].src
}

function show_hide_basemap_menu(n) {
    if (n) {
        document.getElementById("basemap_menu").style.visibility = 'visible';
        document.getElementById("basemap_button").style.visibility = 'hidden'
    } else {
        document.getElementById("basemap_menu").style.visibility = 'hidden';
        document.getElementById("basemap_button").style.visibility = 'visible'
    }
}

function MyIntNum(a, b) {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a)) + a
}
var clickTimer = null;

function simulan_ang_touch() {
    if (clickTimer == null) {
        clickTimer = setTimeout(function() {
            clickTimer = null
        }, 500)
    } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        show_hide_about(1)
    }
}

function f() {
    vstatuss = vstatus + 0
}

function numberWithCommas(x) {
    var a = x.toString().split(".");
    return a[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") + (a[1] ? "." + a[1] : "")
}