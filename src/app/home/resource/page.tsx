'use client'

import React, { useEffect, useState } from 'react'
import styles from './resourceStyle.module.scss'
import types from './resourceType'
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Pagination,
  Input,
} from '@nextui-org/react'
import { GetResource, GetMod, DeleteResource } from '@/api'
import ResourceModal from '@/component/resourceModal'
import { toast } from 'sonner'
import NextAutocomplete from '@/component/nextAutocomplete'
import resourceTypes from '@/app/api/resources/resourceType.d'
import Icon from '@/component/icon'

const thList = [
  { mark: 'serial', label: '#' },
  { mark: 'name', label: '名称' },
  { mark: 'code', label: '代码' },
  { mark: 'mod_name', label: '模组' },
  { mark: 'action', label: '操作' },
]

const Resource = () => {
  const [resourceList, setResourceList] = useState<Array<types.ConfigResource>>(
    []
  )
  const [resource, setResource] = useState<types.ConfigResource | null>(null)
  const [name, setName] = useState('')
  const [mod, setMod] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [modList, setModList] = useState<Array<types.ConfigMod>>([])
  const [mode, setMode] = useState<types.ConfigMode>('edit')

  useEffect(() => {
    setPage(1)
    renderResource(1)
  }, [name, mod])

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    !isOpen && setMode('edit')
  }, [isOpen])

  const renderResource = async (p?: number) => {
    getMod()
    const response = await GetResource({
      name,
      mod: mod ?? '',
      page: p || page,
    })
    const { code, data, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    let serial = ((p || page) - 1) * 10 + 1
    data.resourceList.map((resource: types.ConfigResource) => {
      resource.serial = serial
      serial++
    })
    const pages = Math.ceil(data.total / 10)
    setPages(pages)
    setResourceList(data.resourceList)
  }

  const renderCell = (
    resource: types.ConfigResource,
    columnKey: types.ConfigColumnKey
  ) => {
    switch (columnKey) {
      case 'serial':
        return resource[columnKey]
      case 'name':
        return resource[columnKey]
      case 'code':
        return resource[columnKey]
      case 'mod_name':
        return resource[columnKey]
      case 'action':
        return (
          <div className={styles['action']}>
            <Icon font={''} size="1.1rem" onPress={() => generate(resource)} />
            <Icon font={''} size="1.1rem" onPress={() => edit(resource)} />
            <Icon
              font={''}
              size="1.1rem"
              color="#ff0061"
              onPress={() => remove(resource.id)}
            />
          </div>
        )
      default:
        const check: never = columnKey
        return check
    }
  }

  const generate = (resource: types.ConfigResource) => {
    setMode('generate')
    setResource(resource)
    onOpen()
  }

  const reRender = () => {
    renderResource()
  }

  const create = () => {
    setResource(null)
    onOpen()
  }

  const edit = (resource: types.ConfigResource) => {
    setResource(resource)
    onOpen()
  }

  const remove = async (id: number) => {
    const response = await DeleteResource({ id })
    const { code, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    if (resourceList.length === 1 && page > 1) {
      setPage(page - 1)
      renderResource(page - 1)
      return
    }
    renderResource()
  }

  const changePagination = (p: number) => {
    renderResource(p)
    setPage(p)
  }

  const getMod = async () => {
    const response = await GetMod()
    const { code, data, msg } = await response.json()
    if (code !== 200) {
      toast.error(msg)
      return
    }
    const modList = data.map((mod: resourceTypes.ConfigResource) => {
      return {
        label: mod.name,
        value: mod.id,
      }
    })
    setModList(modList)
  }

  return (
    <div className={styles['resource']}>
      <div className={styles['resource-header']}>
        <Input
          className={styles['resource-header-input']}
          variant="bordered"
          size="sm"
          isClearable
          type="text"
          radius="md"
          placeholder="请输入词条名称"
          value={name}
          onValueChange={setName}
        />
        {modList.length > 0 && (
          <NextAutocomplete
            placeholder="请选择词条分类"
            width="200px"
            defaultItems={modList}
            onSelectionChange={setMod}
          />
        )}
        <Button
          className={styles['resource-header-button']}
          size="sm"
          color="primary"
          onPress={create}
        >
          新建
        </Button>
      </div>
      <ResourceModal
        title="创建词条"
        mode={mode}
        resource={resource}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        reRender={reRender}
      />
      <Table
        aria-label="Example static collection table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={page => changePagination(page)}
            />
          </div>
        }
      >
        <TableHeader columns={thList}>
          {th => <TableColumn key={th.mark}>{th.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={'尚未创建任何字段'} items={resourceList}>
          {resource => (
            <TableRow key={resource.id}>
              {columnKey => (
                <TableCell>
                  {renderCell(resource, columnKey as types.ConfigColumnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default Resource
