const path = require("path")
const depcruise = require("dependency-cruiser").cruise;

const uniq = arr =>  Array.from(new Set(arr))

const resolveDependency = (map, files) => {
    const newFiles = files.flatMap(f => map.has(f) ? resolveDependency(map, map.get(f)).concat(f) : [f])
    return uniq(newFiles)
}

const getDep = (depModules)=> {
    const map = depModules
        .map(({source, dependencies}) => ({source, dependencies}))
        .reduce((o, {source, dependencies})=> {
            if(!o.has(source)) o.set(source, [])
            dependencies.forEach(({resolved}) => o.has(resolved) ? o.get(resolved).push(source) : o.set(resolved, [source]))
            return o
        }, new Map())
    return Array.from(map.entries())
        .map(([key, arr])=> [key, resolveDependency(map, arr)])   
}

const main = ()=> {
    console.log(getDep(depcruise([path.resolve(__dirname, "..","..","..","src")]).output.modules))
}

main()