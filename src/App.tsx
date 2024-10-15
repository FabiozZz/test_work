import React from 'react'
import {getCatalog, getDetails} from "./pages/catalog/catalog-service";
import {
    Box,
    Card, CardContent,
    CardHeader,
    Drawer, FormLabel,
    Grid2 as Grid,
    IconButton, Pagination,
    Paper, Skeleton,
    Slider,
    styled,
    TextField, Typography
} from "@mui/material";
import FilterEmpty from '@mui/icons-material/FilterAltOff';
import FilterActive from '@mui/icons-material/FilterAlt';
import {useDebounce} from "./hooks/useDebounce";
import {AppApiProductSchemaProductSchema, CatalogResponseSchema} from "./api-client";

const skeletonArr = Array(25).fill({});

function App() {

    const [data, setData] = React.useState<CatalogResponseSchema>({
        data: [],
        article: '',
        contains: '',
        page: 1,
        endswith: '',
        startswith: '',

        max_result: 25,
        kind_search: 1
    })

    const [detailData, setDetailData] = React.useState<null | AppApiProductSchemaProductSchema>(null)

    const [isFetching, setIsFetching] = React.useState(false)
    const [isFetchingDetail, setIsFetchingDetail] = React.useState(false)

    const [params, setParams] = React.useState({
        startswith: '',
        endswith: '',
        contains: '',
        article: '',
        page: 1,
    })

    const [filterDrawer, setFilterDrawer] = React.useState(false)
    const [detailDrawer, setDetailDrawer] = React.useState(false)

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>, newValue?: number | number[]) => {
        const {target} = ev;
        let value: string | number | number[] = target.value;
        localStorage.setItem('page', '1')
        setParams(prevState => ({...prevState, [target.name]: value, page: 1}));
    }

    const isActiveFilter = React.useMemo(() => {
        let isEmpty = true;
        for (const paramsKey in params) {
            if (paramsKey !== 'price' && paramsKey !== 'page') {
                if (params[paramsKey as keyof typeof params]) {
                    isEmpty = false
                    break;
                }

            }
        }
        return !isEmpty
    }, [params])
    const debounceQuery = useDebounce<typeof params>(params, 800)


    React.useEffect(() => {
        getCatalog(debounceQuery!).then((response) => {
            setData(response)
        }).finally(() => setIsFetching(false))
    }, [debounceQuery]);

    React.useEffect(() => {
        setIsFetching(true)
    }, [params]);

    React.useLayoutEffect(() => {
        const currentPage = localStorage.getItem('page')
        if (currentPage) {
            setParams(prevState => ({...prevState, page: +currentPage}))
        }
    }, [])

    return (
        <Box display={'grid'} gridTemplateColumns={'1fr'} gridTemplateRows={'min-content 1fr min-content'}
             height={'100%'} flexDirection='column'>
            <Drawer open={detailDrawer} onClose={() => setDetailDrawer(false)} anchor={'right'}>
                <Box width={'500px'} display={'flex'} textAlign={'left'} flexDirection='column' gap={2} p={2}>
                    <Typography variant={'h6'} p={1} textAlign={'center'}>Карточка товара</Typography>
                    <Box width={'100%'} alignItems={"start"} gridTemplateColumns={'min-content 1fr'}
                         gridAutoRows={'min-content'} display={'grid'}>
                        <Typography whiteSpace={'nowrap'} color={'info'} variant={'subtitle1'} p={1}>Бренд</Typography>
                        <Typography variant={'subtitle1'} p={1}
                        >{detailData?.brand?.name}</Typography>

                        <Typography whiteSpace={'nowrap'} color={'info'} variant={'subtitle1'} p={1}
                        >Наименование</Typography>
                        <Typography variant={'subtitle1'} p={1}>{detailData?.name}</Typography>
                        {detailData?.name !== detailData?.full_name &&
                            (
                                <React.Fragment>
                                    <Typography whiteSpace={'nowrap'} color={'info'} variant={'subtitle1'} p={1}>Полное
                                        наименование</Typography>
                                    <Typography variant={'subtitle1'} p={1}
                                    >{detailData?.full_name}</Typography>
                                </React.Fragment>
                            )
                        }
                        <Typography whiteSpace={'nowrap'} color={'info'} variant={'subtitle1'}
                                    p={1}>производитель</Typography>
                        <Typography variant={'subtitle1'} p={1}
                        >{detailData?.manufacture?.name}</Typography>
                    </Box>
                    {detailData?.description?.trim() && (
                        <React.Fragment>
                            <Typography color={'info'} variant={'subtitle1'} p={1}
                            >Описание</Typography>
                            <Typography variant={'subtitle1'} p={1}
                            >{detailData!.description}</Typography>
                        </React.Fragment>
                    )}

                </Box>
            </Drawer>
            <Drawer open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                <Box width={'400px'} display={'flex'} flexDirection='column' gap={2} p={2}>
                    <Box p={1}>Поиск по каталогу</Box>
                    <Box whiteSpace={'nowrap'} gap={'10px'} display={'grid'} gridTemplateColumns={'min-content 1fr'}
                         gridAutoRows={'min-content'}>
                        <FormLabel htmlFor={'startswith'}>
                            начинается с:
                        </FormLabel>
                        <TextField id={'startswith'} onChange={onChange} variant='standard' size='small' type="text"
                                   value={params.startswith}
                                   name="startswith"/>
                        <FormLabel>
                            заканчивается на:
                        </FormLabel>
                        <TextField onChange={onChange} variant='standard' size='small' type="text"
                                   value={params.endswith}
                                   name="endswith"/>
                        <FormLabel>
                            содержит:
                        </FormLabel>
                        <TextField onChange={onChange} variant='standard' size='small' type="text"
                                   value={params.contains}
                                   name="contains"/>
                        <FormLabel>
                            артикль
                        </FormLabel>
                        <TextField onChange={onChange} variant='standard' size='small' type="text"
                                   value={params.article}
                                   name="article"/>

                    </Box>


                </Box>
            </Drawer>
            <Box p={2}>header</Box>
            <Box display={"grid"} gridTemplateColumns={'1fr'} gridTemplateRows={'1fr min-content'} p={2}
                 position="relative" overflow={'auto'}>
                <IconButton onClick={() => setFilterDrawer(true)}
                            sx={{background: 'white !important', position: 'absolute', left: '10px', bottom: '10px'}}>
                    {isActiveFilter ? <FilterActive color='primary'/> : <FilterEmpty/>}
                </IconButton>
                <Grid display={'grid'} gridTemplateColumns={'repeat(5,1fr)'} gridAutoRows={'min-content'}
                      container spacing={2}>
                    {isFetching ?
                        skeletonArr.map(i => <Card sx={{padding: '5px'}}>
                            <Skeleton height={60}/>
                            <Box width={'100%'} alignItems={"center"} justifyContent={'space-between'} display={'flex'}>
                                <Skeleton width={'40%'} height={30}/><Skeleton width={'30%'} height={30}/>
                            </Box>
                            <Box width={'100%'} alignItems={"center"} justifyContent={'space-between'} display={'flex'}>
                                <Skeleton width={'40%'} height={30}/><Skeleton width={'30%'} height={30}/>
                            </Box>

                        </Card>)
                        :
                        data.data.map(item => {
                            return (
                                <Card sx={{
                                    padding: '5px',
                                    transition:'scale linear 0.2s',
                                    '&:hover':{
                                        scale:'1.1'
                                    }

                                }} onClick={() => {
                                    setIsFetchingDetail(true)
                                    setDetailDrawer(true)
                                    getDetails(item.id).then(response => setDetailData(response)).finally(() => setIsFetchingDetail(false))
                                }}>
                                    <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
                                        <Typography component={'div'} sx={{
                                            'max-height': '60px',
                                            'vertical-align': 'center',
                                            overflow:'hidden',
                                            textOverflow:'ellipsis',
                                            'white-space': 'normal',
                                            'word-wrap': 'break-word',
                                            'display': '-webkit-box',
                                            '-webkit-line-clamp': '2',
                                            '-webkit-box-orient': 'vertical',
                                        }} variant='h6' lineHeight={1.2} fontSize={18}>{item?.name}</Typography>
                                        <Box mt={1} width={'100%'} alignItems={"center"} justifyContent={'space-between'}
                                             display={'flex'}>
                                            <Typography>Дата
                                                создания:</Typography><Typography>{new Date(item.created_at).toLocaleDateString('ru-Ru')}</Typography>
                                        </Box>
                                        <Box width={'100%'} alignItems={"center"} justifyContent={'space-between'}
                                             display={'flex'}>
                                            <Typography>Дата
                                                обновления:</Typography><Typography>{new Date(item.updated_at).toLocaleDateString('ru-Ru')}</Typography>
                                        </Box>

                                    </Box>
                                </Card>
                            )
                        })
                    }

                </Grid>
                <Box display={'flex'} justifyContent={'center'}>
                    <Pagination disabled={isFetching || isFetchingDetail} page={params.page} count={data.total_pages}
                                onChange={(ev, page) => {
                                    localStorage.setItem('page', page.toString())
                                    setParams(prevState => ({...prevState, page}))
                                }}/>
                </Box>
            </Box>
            <Box p={2}>footer</Box>

        </Box>
    );
}

export default App
