import * as FS                 from 'fs';
import UUID               from 'uuid/v1';
import * as HasBin             from 'hasbin';
import * as IsRoot             from 'is-root';
import { Signale }             from 'signale';
import { ChildProcess, spawn } from 'child_process';

export class Teleporter {

    constructor() {
        const signale_config = {
            scope: 'teleptr',
            types: {
                info: {
                    badge: '',
                    color: 'blue',
                    label: 'INFO'
                },
                fatal: {
                    badge: '',
                    color: 'red',
                    label: '[KO]'
                },
                warn: {
                    badge: '',
                    color: 'yellow',
                    label: '[!!]'
                }
            }
        };
        this.log = new Signale(signale_config);
        this.portals = [];
        this.isEnabled = false;
        this.location = UUID();
        this.teleporting = false;
    }

    get enabled() {
        return this.isEnabled;
    }

    get Location() {
        return this.location;
    }

    enable() {
        if (!HasBin.sync('openvpn')) {
            throw new Error('Teleporter cannot locate openvpn binary');
        }

        if (!IsRoot()) {
            throw new Error('Teleporter requires root permissions');
        }

        this.isEnabled = true;
    }

    setAuth(auth) {
        if (!FS.existsSync(auth)) {
            throw new Error(`path '${auth}' does not exist`);
        }

        this.auth = auth;
    }

    addPortalDir(dir) {
        if (!FS.existsSync(dir)) {
            throw new Error(`path '${dir}' does not exist`);
        }

        if (!FS.statSync(dir).isDirectory()) {
            throw new Error(`path '${dir}' is not a directory`);
        }

        const data = FS.readdirSync(dir).map((file) => dir + '/' + file);

        this.portals = [
            ...this.portals,
            ...data
        ];
    }

    listPortals() {
        for (const portal of this.portals) {
            this.log.info(`[${new Date(Date.now())}]\t\t[LOADED] ${portal}`);
        }
    }

    teleport() {
        if (this.teleporting) return;
        this.teleporting = true;

        if (this.openvpn) {
            this.openvpn.kill();
            this.openvpn = undefined;
            this.location = UUID();
            this.teleporting = false;
            return ;
        }

        let args;
        const random_portal = Math.floor(Math.random() * this.portals.length);
        if (process.platform === 'darwin') {
            args = [
                '--up', `${__dirname}/teleporter_resources/update-resolv-conf`,
                '--down', `${__dirname}/teleporter_resources/update-resolv-conf`,
                '--script-security', '2',
                '--config', this.portals[random_portal]
            ];
        } else {
            args = [
                '--up', '/etc/openvpn/update-resolv-conf',
                '--down', '/etc/openvpn/update-resolv-conf',
                '--script-security', '2',
                '--config', this.portals[random_portal]
            ];

        }
        if (this.auth) {
            args.push('--auth-user-pass');
            args.push(this.auth);
        }
        this.openvpn = spawn('openvpn', args);
        this.openvpn.stdout.on('data', (data) => {
            if (data.toString().indexOf('Initialization Sequence Completed') !== -1) {
                this.location = UUID();
                this.log.info(`[${new Date(Date.now())}]\t\t[Teleportation Successful] [${this.portals[random_portal]}]`);
                this.teleporting = false;
            }
        });

        this.openvpn.stderr.on('data', (data) => {
            //Signale.fatal(data.toString());
        });
        this.openvpn.on('close', (code) => {
            this.log.info(`[${new Date(Date.now())}]\t\t[Closing Portal]`);
        });
    }

}
