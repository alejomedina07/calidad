const ftp = require('basic-ftp');
const fs = require('fs');
var debug = require('debug')('BC:ctrFTP');

class FTPClient {
    constructor(host = '172.16.2.28', port = 21, username = 'admin_ftp', password = 'SR-53rv1d0r', secure = false) {
        this.client = new ftp.Client();
        this.settings = {
            host: host,
            port: port,
            user: username,
            password: password,
            secure: secure
        };
    }

    upload(sourcePath, remotePath, permissions) {
        debug('sourcePath');
        debug(sourcePath);
        debug('remotePath');
        debug(remotePath);
        let self = this;
        (async () => {
            try {
              debug('await self.client.list()');
              // debug(await self.client.list());
              await self.client.ensureDir("/fotos/calidad")
              await self.client.uploadFrom( remotePath, sourcePath)
              // await client.downloadTo("README_COPY.md", "README_FTP.md")
                // let access = await self.client.access(self.settings);
                // let upload = await self.client.upload(fs.createReadStream(sourcePath), remotePath);
                // let permissions = await self.changePermissions(permissions.toString(), remotePath);
            } catch(err) {
              debug('');
              debug(err);
                console.log(err);
            }
            self.client.close();
        })();
    }

    close() {
        this.client.close();
    }

    changePermissions(perms, filepath) {
        let cmd = 'SITE CHMOD ' + perms + ' ' + filepath;
        return this.client.send(cmd, false);
    }
}

module.exports = FTPClient;
