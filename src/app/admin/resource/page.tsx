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
  Image,
} from '@nextui-org/react'
import { GetResource, GetMod } from '@/api'
import ResourceModal from '@/component/resourceModal'
import { toast } from 'sonner'
import NextAutocomplete from '@/component/nextAutocomplete'
import resourceTypes from '@/app/api/resources/resourceType.d'
import Icon from '@/component/icon'

const thList = [
  { mark: 'serial', label: '#' },
  { mark: 'name', label: '名称' },
  { mark: 'code', label: '代码' },
  { mark: 'thumbnail', label: '缩略图' },
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
      page: p ?? page,
    })
    const { code, data, msg } = await response.json()
    if (code !== 200) return toast.error(msg)
    let serial = ((p ?? page) - 1) * 10 + 1
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
        return resource[columnKey] === 'null' ? (
          <Icon font={''} size="1.1rem" cursor="text" />
        ) : (
          resource[columnKey]
        )
      case 'thumbnail':
        return (
          resource[columnKey] && (
            <Image
              isZoomed
              width={40}
              radius="sm"
              alt={resource['name']}
              src={`/${resource[columnKey]}`}
            />
          )
        )
      case 'mod_name':
        return resource[columnKey]
      case 'action':
        return (
          <div className={styles['action']}>
            <Icon
              font={''}
              size="1.1rem"
              onPress={() => changeModalMode('generate', resource)}
            />
            <Icon
              font={''}
              size="1.1rem"
              onPress={() => changeModalMode('edit', resource)}
            />
            <Icon
              font={''}
              size="1.1rem"
              color="#ff0061"
              onPress={() => changeModalMode('delete', resource)}
            />
          </div>
        )
      default:
        const check: never = columnKey
        return check
    }
  }

  const reRender = (mark: types.ConfigMode) => {
    if (mark === 'delete' && resourceList.length === 1 && page > 1) {
      setPage(page - 1)
      renderResource(page - 1)
      return
    }
    renderResource()
  }

  const changeModalMode = (
    mark: types.ConfigMode,
    resource?: types.ConfigResource
  ) => {
    setMode(mark)
    setResource(resource ?? null)
    onOpen()
  }

  const changePagination = (p: number) => {
    renderResource(p)
    setPage(p)
  }

  const getMod = async () => {
    const response = await GetMod()
    const { code, data, msg } = await response.json()
    if (code !== 200) return toast.error(msg)
    const modList = data.map((mod: resourceTypes.ConfigResource) => ({
      label: mod.name,
      value: mod.id,
    }))
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
            placeholder="请选择所属模组"
            width="200px"
            defaultItems={modList}
            onSelectionChange={setMod}
          />
        )}
        <Button
          className={styles['resource-header-button']}
          size="sm"
          color="primary"
          onPress={() => changeModalMode('edit')}
        >
          新建
        </Button>
      </div>
      <ResourceModal
        title="词条"
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
