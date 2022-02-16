/*
 * Copyright 2019-2022 Igalia, S.L.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Mustache from 'mustache';
import { load as load_template } from './templates';

var configjson = require('../config.json');
var template;
var page = {
    apps: []
};

function render() {
    document.body.innerHTML = Mustache.render(template, page);
}

function load_application_list() {
    navigator.appService.getApplications(true, apps => {
        page.apps = [];

        for( var i=0; i<apps.length; i++) { 
            if( configjson.black_list.indexOf(apps[i][0]) === -1 ) {
                (function(app) {
                    let app_entry = {};
                    app_entry.id = app[0];
                    app_entry.name = app[1];
                    if( configjson.icons[app_entry.id.split('@')[0]] ) {
                        app_entry.icon = configjson.icons[app_entry.id.split('@')[0]];
                    } else {
                        app_entry.icon = undefined;
                        app_entry.letter = app[1][0];
                    }

                    page.apps.push(app_entry);
                })(apps[i]);
            }
        }
        
        render();
    });
}

export function launch(appId) {
    console.log(appId);
    navigator.appService.start(appId.split('@')[0]);
}

export function init() {
    load_template('apps.template.html').then(function(result) {
        template = result;
        Mustache.parse(template);
        load_application_list();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });
    
}