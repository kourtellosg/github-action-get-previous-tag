const { exec } = require('child_process');

const RELEASE_REGEX = process.env.RELEASE_CANIDATE === 'false' ? "v[0-9]\.[0-9]\.[0-9] " : "v[0-9]\.[0-9]\.[0-9]-rc[0-9]";

exec(`git for-each-ref --sort=tag --sort=-authordate refs/tags/ --format="%(*refname:short)" | tr "^{}" " " | grep "${RELEASE_REGEX}"`, (err, revs, stderr) => {
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
            if (process.env.RELEASE_CANIDATE && rev.includes('-rc')) {
                console.log('RELEASE_CANIDATE', rev);
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${rev}`);
                console.log(`::set-output name=tag::${rev}`);
                process.exit(0);
                break;
            } else {
                console.log('NO_RELEASE_CANIDATE', rev);
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${rev}`);
                console.log(`::set-output name=tag::${rev}`);
                process.exit(0);
                break;
            }
        } 
    }
    
});