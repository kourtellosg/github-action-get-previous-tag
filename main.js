const { exec } = require('child_process');

const RELEASE_REGEX = () => {
    if (process.env.ENVIRONMENT === 'prod') {
        return "v[0-9]\.[0-9]\.[0-9] ";
    } else if (process.env.ENVIRONMENT === 'preprod') {
        return "v[0-9]\.[0-9]\.[0-9]-rc[0-9]";
    } else if (process.env.ENVIRONMENT === 'stg3') {
        return "v[0-9]\.[0-9]\.[0-9]-stg[0-9]";
    } else if (process.env.ENVIRONMENT === 'stg3wl') {
        return "v[0-9]\.[0-9]\.[0-9]-stgwl[0-9]";
    } else if (process.env.ENVIRONMENT === 'wl') {
        return "v[0-9]\.[0-9]\.[0-9]-wl[0-9]";    
    } else {
        return null;
    }
}

exec(`git for-each-ref --sort=tag --sort=-authordate refs/tags/ --format="%(*refname:short)" | tr "^{}" " " | grep "${RELEASE_REGEX()}"`, (err, revs, stderr) => {
    if (!RELEASE_REGEX()) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ENVIRONMENT not provided or not supported');
        console.log('\x1b[33m%s\x1b[0m', 'Supported ENVIRONMENT: "prod" | "preprod" | "stg3".');
        process.exit(1);

        return;
    }

    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);

        return;
    }

    const arrayOfRevs = revs.split("\n");
    arrayOfRevs.pop();

    for (let [i, rev] of arrayOfRevs.entries()) {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);

            return;
        }
        if (i > 0) {
            if (process.env.ENVIRONMENT === 'preprod' && rev.includes('-rc')) {
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${rev}`);
                console.log(`::set-output name=tag::${rev}`);
                process.exit(0);
                break;
            } else if (process.env.ENVIRONMENT === 'stg3' && rev.includes('-stg')) {
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${rev}`);
                console.log(`::set-output name=tag::${rev}`);
                process.exit(0);
                break;
            } else {
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${rev}`);
                console.log(`::set-output name=tag::${rev}`);
                process.exit(0);
                break;
            }
        }
    }

});
