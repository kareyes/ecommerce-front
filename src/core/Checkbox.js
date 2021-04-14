import React, {useEffect, useState} from "react"

const Checkbox = ({categories, handleFilters}) => {

    const [checked, setChecked] = useState([])
    const handleToggle = c => () => {
        const currentCategoryId = checked.indexOf(c)
        const newCheckedCatoryId = [...checked]

        if(currentCategoryId === -1){
            newCheckedCatoryId.push(c)
        }else{
            newCheckedCatoryId.splice(currentCategoryId, 1)
        }
        // console.log(newCheckedCatoryId)
        setChecked(newCheckedCatoryId)
        handleFilters(newCheckedCatoryId)
    }

    return categories.map((c, i) => (
        <li key={i} className="list-unstyled">
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type="checkbox" className="form-check-input" />
            <label  className="form-check-label">{c.name}</label>
        </li>
    ))
}
export default Checkbox;