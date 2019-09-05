import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import api from '../lib/api'
import debounce from 'lodash/debounce'
const Option = Select.Option

function SearchUser({onChange,value}) {
    // { current : 0}
    const lastFetchId = useRef(0)
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])

    const fetchUser = useCallback(debounce(value => {
        

        lastFetchId.current += 1
        const fetchId = lastFetchId.current
        setFetching(true)
        setOptions([])

        api.request({
            url: `/search/users?q=${value}`
        }).then(res => {
            console.log(res)
            if(fetchId  !== lastFetchId.current){
                return 
            }
            const data = res.data.items.map(user => ({
                text: user.login,
                value: user.login
            }))
            setFetching(false)
            setOptions(data)
        })

    }, 500), [])

    const handleChange = (value) => {
        setOptions([])
        setFetching(false)

        onChange(value)
        
    }
    return (
        <Select
            showSearch={true}
            notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
            filterOption={false}
            placeholder="创建者"
            allowClear={true}
            value={value}
            onSearch={fetchUser}
            style={{ width: '200px' }}
            onChange={handleChange}
        >
            {
                options.map(option => (<Option value={option.value} key={option.value}>{option.text}</Option>))
            }
        </Select>
    )
}

export default SearchUser