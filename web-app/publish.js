const {execSync} = require('child_process');

const branch = process.env.TRAVIS_BRANCH;

const main = async () => {

    switch (branch) {
        case 'rinkeby': {
            const version = require('./package').version;
            const revision = require('child_process')
                .execSync('git rev-parse HEAD')
                .toString().trim().slice(0, 7);

            const tag_name = `${version}-rinkeby.${revision}`;
            try {
                console.log(`Connecting to docker hub`);
                execSync(`docker login -u ${process.env.DOCKER_USERNAME} -p ${process.env.DOCKER_PASSWORD}`);
                console.log(`Connected to docker hub`);

                console.log(`Tagging previously built image`);
                execSync(`docker tag webapp ${process.env.DOCKER_WEBAPP_REPOSITORY}:${tag_name}`);
                execSync(`docker tag webapp ${process.env.DOCKER_WEBAPP_REPOSITORY}:latest-rinkeby`);
                console.log(`Tagged previously built image`);

                console.log(`Pushing to docker hub`);
                execSync(`docker push ${process.env.DOCKER_WEBAPP_REPOSITORY}:${tag_name}`);
                execSync(`docker push ${process.env.DOCKER_WEBAPP_REPOSITORY}:latest-rinkeby`);
                console.log(`Pushed to docker hub`);
            } catch (e) {
                console.error(e);
                process.exit(1);
            }

            break ;
        }
        case 'ropsten': {
            const version = require('./package').version;
            const revision = require('child_process')
                .execSync('git rev-parse HEAD')
                .toString().trim().slice(0, 7);

            const tag_name = `${version}-ropsten.${revision}`;
            try {
                console.log(`Connecting to docker hub`);
                execSync(`docker login -u ${process.env.DOCKER_USERNAME} -p ${process.env.DOCKER_PASSWORD}`);
                console.log(`Connected to docker hub`);

                console.log(`Tagging previously built image`);
                execSync(`docker tag webapp ${process.env.DOCKER_WEBAPP_REPOSITORY}:${tag_name}`);
                execSync(`docker tag webapp ${process.env.DOCKER_WEBAPP_REPOSITORY}:latest-ropsten`);
                console.log(`Tagged previously built image`);

                console.log(`Pushing to docker hub`);
                execSync(`docker push ${process.env.DOCKER_WEBAPP_REPOSITORY}:${tag_name}`);
                execSync(`docker push ${process.env.DOCKER_WEBAPP_REPOSITORY}:latest-ropsten`);
                console.log(`Pushed to docker hub`);
            } catch (e) {
                console.error(e);
                process.exit(1);
            }

            break ;
        }

        case 'mainnet': {

        }
    }

};

main();
