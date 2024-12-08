async function registerPath(app, fullEndpoint, destination, redirect, shouldDelete=false) {
    console.log(`Registering path: ${fullEndpoint} -> ${destination} (${redirect})`)

    if (!fullEndpoint.startsWith("/")) {
        fullEndpoint = "/"+fullEndpoint
    }
    // Dynamically register the route
    console.log(fullEndpoint)
    console.log(shouldDelete)
    app.get(fullEndpoint, (req, res) => {
        if (shouldDelete){
            res.status(404).send("Not Found")
        } else {
            res.redirect(redirect, destination)
        }
        
    })
}

export {registerPath}