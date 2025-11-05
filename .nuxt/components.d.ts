
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'AccountOrder': typeof import("../components/Account/Order.vue")['default']
    'AccountWechat': typeof import("../components/Account/Wechat.vue")['default']
    'CommonAiAssistant': typeof import("../components/Common/AiAssistant.vue")['default']
    'CommonFooter': typeof import("../components/Common/Footer.vue")['default']
    'CommonHeader': typeof import("../components/Common/Header.vue")['default']
    'CommonLink': typeof import("../components/Common/Link.vue")['default']
    'CommonPagination': typeof import("../components/Common/Pagination.vue")['default']
    'CommonPay': typeof import("../components/Common/Pay.vue")['default']
    'CommonPdfViewer': typeof import("../components/Common/PdfViewer.vue")['default']
    'CommonRichTextEditor': typeof import("../components/Common/RichTextEditor.vue")['default']
    'CommonUser': typeof import("../components/Common/User.vue")['default']
    'CourseChapter': typeof import("../components/Course/Chapter.vue")['default']
    'CourseChoose': typeof import("../components/Course/Choose.vue")['default']
    'CourseCollect': typeof import("../components/Course/Collect.vue")['default']
    'CourseCommentList': typeof import("../components/Course/CommentList.vue")['default']
    'CourseAI': typeof import("../components/Course/CourseAI.vue")['default']
    'CourseExam': typeof import("../components/Course/CourseExam.vue")['default']
    'CourseHomework': typeof import("../components/Course/CourseHomework.vue")['default']
    'CourseList': typeof import("../components/Course/List.vue")['default']
    'CourseNoteList': typeof import("../components/Course/NoteList.vue")['default']
    'CourseProgressTracker': typeof import("../components/Course/ProgressTracker.vue")['default']
    'CourseVideoPlayer': typeof import("../components/Course/VideoPlayer.vue")['default']
    'LecturerList': typeof import("../components/Lecturer/List.vue")['default']
    'WorksWorkUpload': typeof import("../components/Works/WorkUpload.vue")['default']
    'WorksWorkWall': typeof import("../components/Works/WorkWall.vue")['default']
    'ZoneCategory': typeof import("../components/Zone/Category.vue")['default']
    'ZoneCourse': typeof import("../components/Zone/Course.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ElAffix': typeof import("element-plus/es/components/affix/index")['ElAffix']
    'ElAlert': typeof import("element-plus/es/components/alert/index")['ElAlert']
    'ElAutocomplete': typeof import("element-plus/es/components/autocomplete/index")['ElAutocomplete']
    'ElAutoResizer': typeof import("element-plus/es/components/table-v2/index")['ElAutoResizer']
    'ElAvatar': typeof import("element-plus/es/components/avatar/index")['ElAvatar']
    'ElBacktop': typeof import("element-plus/es/components/backtop/index")['ElBacktop']
    'ElBadge': typeof import("element-plus/es/components/badge/index")['ElBadge']
    'ElBreadcrumb': typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumb']
    'ElBreadcrumbItem': typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumbItem']
    'ElButton': typeof import("element-plus/es/components/button/index")['ElButton']
    'ElButtonGroup': typeof import("element-plus/es/components/button/index")['ElButtonGroup']
    'ElCalendar': typeof import("element-plus/es/components/calendar/index")['ElCalendar']
    'ElCard': typeof import("element-plus/es/components/card/index")['ElCard']
    'ElCarousel': typeof import("element-plus/es/components/carousel/index")['ElCarousel']
    'ElCarouselItem': typeof import("element-plus/es/components/carousel/index")['ElCarouselItem']
    'ElCascader': typeof import("element-plus/es/components/cascader/index")['ElCascader']
    'ElCascaderPanel': typeof import("element-plus/es/components/cascader-panel/index")['ElCascaderPanel']
    'ElCheckTag': typeof import("element-plus/es/components/check-tag/index")['ElCheckTag']
    'ElCheckbox': typeof import("element-plus/es/components/checkbox/index")['ElCheckbox']
    'ElCheckboxButton': typeof import("element-plus/es/components/checkbox/index")['ElCheckboxButton']
    'ElCheckboxGroup': typeof import("element-plus/es/components/checkbox/index")['ElCheckboxGroup']
    'ElCol': typeof import("element-plus/es/components/col/index")['ElCol']
    'ElCollapse': typeof import("element-plus/es/components/collapse/index")['ElCollapse']
    'ElCollapseItem': typeof import("element-plus/es/components/collapse/index")['ElCollapseItem']
    'ElCollapseTransition': typeof import("element-plus/es/components/collapse-transition/index")['ElCollapseTransition']
    'ElColorPicker': typeof import("element-plus/es/components/color-picker/index")['ElColorPicker']
    'ElConfigProvider': typeof import("element-plus/es/components/config-provider/index")['ElConfigProvider']
    'ElContainer': typeof import("element-plus/es/components/container/index")['ElContainer']
    'ElAside': typeof import("element-plus/es/components/container/index")['ElAside']
    'ElFooter': typeof import("element-plus/es/components/container/index")['ElFooter']
    'ElHeader': typeof import("element-plus/es/components/container/index")['ElHeader']
    'ElMain': typeof import("element-plus/es/components/container/index")['ElMain']
    'ElDatePicker': typeof import("element-plus/es/components/date-picker/index")['ElDatePicker']
    'ElDescriptions': typeof import("element-plus/es/components/descriptions/index")['ElDescriptions']
    'ElDescriptionsItem': typeof import("element-plus/es/components/descriptions/index")['ElDescriptionsItem']
    'ElDialog': typeof import("element-plus/es/components/dialog/index")['ElDialog']
    'ElDivider': typeof import("element-plus/es/components/divider/index")['ElDivider']
    'ElDrawer': typeof import("element-plus/es/components/drawer/index")['ElDrawer']
    'ElDropdown': typeof import("element-plus/es/components/dropdown/index")['ElDropdown']
    'ElDropdownItem': typeof import("element-plus/es/components/dropdown/index")['ElDropdownItem']
    'ElDropdownMenu': typeof import("element-plus/es/components/dropdown/index")['ElDropdownMenu']
    'ElEmpty': typeof import("element-plus/es/components/empty/index")['ElEmpty']
    'ElForm': typeof import("element-plus/es/components/form/index")['ElForm']
    'ElFormItem': typeof import("element-plus/es/components/form/index")['ElFormItem']
    'ElIcon': typeof import("element-plus/es/components/icon/index")['ElIcon']
    'ElImage': typeof import("element-plus/es/components/image/index")['ElImage']
    'ElImageViewer': typeof import("element-plus/es/components/image-viewer/index")['ElImageViewer']
    'ElInput': typeof import("element-plus/es/components/input/index")['ElInput']
    'ElInputNumber': typeof import("element-plus/es/components/input-number/index")['ElInputNumber']
    'ElInputTag': typeof import("element-plus/es/components/input-tag/index")['ElInputTag']
    'ElLink': typeof import("element-plus/es/components/link/index")['ElLink']
    'ElMenu': typeof import("element-plus/es/components/menu/index")['ElMenu']
    'ElMenuItem': typeof import("element-plus/es/components/menu/index")['ElMenuItem']
    'ElMenuItemGroup': typeof import("element-plus/es/components/menu/index")['ElMenuItemGroup']
    'ElSubMenu': typeof import("element-plus/es/components/menu/index")['ElSubMenu']
    'ElPageHeader': typeof import("element-plus/es/components/page-header/index")['ElPageHeader']
    'ElPagination': typeof import("element-plus/es/components/pagination/index")['ElPagination']
    'ElPopconfirm': typeof import("element-plus/es/components/popconfirm/index")['ElPopconfirm']
    'ElPopover': typeof import("element-plus/es/components/popover/index")['ElPopover']
    'ElPopper': typeof import("element-plus/es/components/popper/index")['ElPopper']
    'ElProgress': typeof import("element-plus/es/components/progress/index")['ElProgress']
    'ElRadio': typeof import("element-plus/es/components/radio/index")['ElRadio']
    'ElRadioButton': typeof import("element-plus/es/components/radio/index")['ElRadioButton']
    'ElRadioGroup': typeof import("element-plus/es/components/radio/index")['ElRadioGroup']
    'ElRate': typeof import("element-plus/es/components/rate/index")['ElRate']
    'ElResult': typeof import("element-plus/es/components/result/index")['ElResult']
    'ElRow': typeof import("element-plus/es/components/row/index")['ElRow']
    'ElScrollbar': typeof import("element-plus/es/components/scrollbar/index")['ElScrollbar']
    'ElSelect': typeof import("element-plus/es/components/select/index")['ElSelect']
    'ElOption': typeof import("element-plus/es/components/select/index")['ElOption']
    'ElOptionGroup': typeof import("element-plus/es/components/select/index")['ElOptionGroup']
    'ElSelectV2': typeof import("element-plus/es/components/select-v2/index")['ElSelectV2']
    'ElSkeleton': typeof import("element-plus/es/components/skeleton/index")['ElSkeleton']
    'ElSkeletonItem': typeof import("element-plus/es/components/skeleton/index")['ElSkeletonItem']
    'ElSlider': typeof import("element-plus/es/components/slider/index")['ElSlider']
    'ElSpace': typeof import("element-plus/es/components/space/index")['ElSpace']
    'ElStatistic': typeof import("element-plus/es/components/statistic/index")['ElStatistic']
    'ElCountdown': typeof import("element-plus/es/components/countdown/index")['ElCountdown']
    'ElSteps': typeof import("element-plus/es/components/steps/index")['ElSteps']
    'ElStep': typeof import("element-plus/es/components/steps/index")['ElStep']
    'ElSwitch': typeof import("element-plus/es/components/switch/index")['ElSwitch']
    'ElTable': typeof import("element-plus/es/components/table/index")['ElTable']
    'ElTableColumn': typeof import("element-plus/es/components/table/index")['ElTableColumn']
    'ElTableV2': typeof import("element-plus/es/components/table-v2/index")['ElTableV2']
    'ElTabs': typeof import("element-plus/es/components/tabs/index")['ElTabs']
    'ElTabPane': typeof import("element-plus/es/components/tabs/index")['ElTabPane']
    'ElTag': typeof import("element-plus/es/components/tag/index")['ElTag']
    'ElText': typeof import("element-plus/es/components/text/index")['ElText']
    'ElTimePicker': typeof import("element-plus/es/components/time-picker/index")['ElTimePicker']
    'ElTimeSelect': typeof import("element-plus/es/components/time-select/index")['ElTimeSelect']
    'ElTimeline': typeof import("element-plus/es/components/timeline/index")['ElTimeline']
    'ElTimelineItem': typeof import("element-plus/es/components/timeline/index")['ElTimelineItem']
    'ElTooltip': typeof import("element-plus/es/components/tooltip/index")['ElTooltip']
    'ElTooltipV2': typeof import("element-plus/es/components/tooltip-v2/index")['ElTooltipV2']
    'ElTransfer': typeof import("element-plus/es/components/transfer/index")['ElTransfer']
    'ElTree': typeof import("element-plus/es/components/tree/index")['ElTree']
    'ElTreeSelect': typeof import("element-plus/es/components/tree-select/index")['ElTreeSelect']
    'ElTreeV2': typeof import("element-plus/es/components/tree-v2/index")['ElTreeV2']
    'ElUpload': typeof import("element-plus/es/components/upload/index")['ElUpload']
    'ElWatermark': typeof import("element-plus/es/components/watermark/index")['ElWatermark']
    'ElTour': typeof import("element-plus/es/components/tour/index")['ElTour']
    'ElTourStep': typeof import("element-plus/es/components/tour/index")['ElTourStep']
    'ElAnchor': typeof import("element-plus/es/components/anchor/index")['ElAnchor']
    'ElAnchorLink': typeof import("element-plus/es/components/anchor/index")['ElAnchorLink']
    'ElSegmented': typeof import("element-plus/es/components/segmented/index")['ElSegmented']
    'ElMention': typeof import("element-plus/es/components/mention/index")['ElMention']
    'ElIconAddLocation': typeof import("@element-plus/icons-vue")['AddLocation']
    'ElIconAim': typeof import("@element-plus/icons-vue")['Aim']
    'ElIconAlarmClock': typeof import("@element-plus/icons-vue")['AlarmClock']
    'ElIconApple': typeof import("@element-plus/icons-vue")['Apple']
    'ElIconArrowDown': typeof import("@element-plus/icons-vue")['ArrowDown']
    'ElIconArrowDownBold': typeof import("@element-plus/icons-vue")['ArrowDownBold']
    'ElIconArrowLeft': typeof import("@element-plus/icons-vue")['ArrowLeft']
    'ElIconArrowLeftBold': typeof import("@element-plus/icons-vue")['ArrowLeftBold']
    'ElIconArrowRight': typeof import("@element-plus/icons-vue")['ArrowRight']
    'ElIconArrowRightBold': typeof import("@element-plus/icons-vue")['ArrowRightBold']
    'ElIconArrowUp': typeof import("@element-plus/icons-vue")['ArrowUp']
    'ElIconArrowUpBold': typeof import("@element-plus/icons-vue")['ArrowUpBold']
    'ElIconAvatar': typeof import("@element-plus/icons-vue")['Avatar']
    'ElIconBack': typeof import("@element-plus/icons-vue")['Back']
    'ElIconBaseball': typeof import("@element-plus/icons-vue")['Baseball']
    'ElIconBasketball': typeof import("@element-plus/icons-vue")['Basketball']
    'ElIconBell': typeof import("@element-plus/icons-vue")['Bell']
    'ElIconBellFilled': typeof import("@element-plus/icons-vue")['BellFilled']
    'ElIconBicycle': typeof import("@element-plus/icons-vue")['Bicycle']
    'ElIconBottom': typeof import("@element-plus/icons-vue")['Bottom']
    'ElIconBottomLeft': typeof import("@element-plus/icons-vue")['BottomLeft']
    'ElIconBottomRight': typeof import("@element-plus/icons-vue")['BottomRight']
    'ElIconBowl': typeof import("@element-plus/icons-vue")['Bowl']
    'ElIconBox': typeof import("@element-plus/icons-vue")['Box']
    'ElIconBriefcase': typeof import("@element-plus/icons-vue")['Briefcase']
    'ElIconBrush': typeof import("@element-plus/icons-vue")['Brush']
    'ElIconBrushFilled': typeof import("@element-plus/icons-vue")['BrushFilled']
    'ElIconBurger': typeof import("@element-plus/icons-vue")['Burger']
    'ElIconCalendar': typeof import("@element-plus/icons-vue")['Calendar']
    'ElIconCamera': typeof import("@element-plus/icons-vue")['Camera']
    'ElIconCameraFilled': typeof import("@element-plus/icons-vue")['CameraFilled']
    'ElIconCaretBottom': typeof import("@element-plus/icons-vue")['CaretBottom']
    'ElIconCaretLeft': typeof import("@element-plus/icons-vue")['CaretLeft']
    'ElIconCaretRight': typeof import("@element-plus/icons-vue")['CaretRight']
    'ElIconCaretTop': typeof import("@element-plus/icons-vue")['CaretTop']
    'ElIconCellphone': typeof import("@element-plus/icons-vue")['Cellphone']
    'ElIconChatDotRound': typeof import("@element-plus/icons-vue")['ChatDotRound']
    'ElIconChatDotSquare': typeof import("@element-plus/icons-vue")['ChatDotSquare']
    'ElIconChatLineRound': typeof import("@element-plus/icons-vue")['ChatLineRound']
    'ElIconChatLineSquare': typeof import("@element-plus/icons-vue")['ChatLineSquare']
    'ElIconChatRound': typeof import("@element-plus/icons-vue")['ChatRound']
    'ElIconChatSquare': typeof import("@element-plus/icons-vue")['ChatSquare']
    'ElIconCheck': typeof import("@element-plus/icons-vue")['Check']
    'ElIconChecked': typeof import("@element-plus/icons-vue")['Checked']
    'ElIconCherry': typeof import("@element-plus/icons-vue")['Cherry']
    'ElIconChicken': typeof import("@element-plus/icons-vue")['Chicken']
    'ElIconChromeFilled': typeof import("@element-plus/icons-vue")['ChromeFilled']
    'ElIconCircleCheck': typeof import("@element-plus/icons-vue")['CircleCheck']
    'ElIconCircleCheckFilled': typeof import("@element-plus/icons-vue")['CircleCheckFilled']
    'ElIconCircleClose': typeof import("@element-plus/icons-vue")['CircleClose']
    'ElIconCircleCloseFilled': typeof import("@element-plus/icons-vue")['CircleCloseFilled']
    'ElIconCirclePlus': typeof import("@element-plus/icons-vue")['CirclePlus']
    'ElIconCirclePlusFilled': typeof import("@element-plus/icons-vue")['CirclePlusFilled']
    'ElIconClock': typeof import("@element-plus/icons-vue")['Clock']
    'ElIconClose': typeof import("@element-plus/icons-vue")['Close']
    'ElIconCloseBold': typeof import("@element-plus/icons-vue")['CloseBold']
    'ElIconCloudy': typeof import("@element-plus/icons-vue")['Cloudy']
    'ElIconCoffee': typeof import("@element-plus/icons-vue")['Coffee']
    'ElIconCoffeeCup': typeof import("@element-plus/icons-vue")['CoffeeCup']
    'ElIconCoin': typeof import("@element-plus/icons-vue")['Coin']
    'ElIconColdDrink': typeof import("@element-plus/icons-vue")['ColdDrink']
    'ElIconCollection': typeof import("@element-plus/icons-vue")['Collection']
    'ElIconCollectionTag': typeof import("@element-plus/icons-vue")['CollectionTag']
    'ElIconComment': typeof import("@element-plus/icons-vue")['Comment']
    'ElIconCompass': typeof import("@element-plus/icons-vue")['Compass']
    'ElIconConnection': typeof import("@element-plus/icons-vue")['Connection']
    'ElIconCoordinate': typeof import("@element-plus/icons-vue")['Coordinate']
    'ElIconCopyDocument': typeof import("@element-plus/icons-vue")['CopyDocument']
    'ElIconCpu': typeof import("@element-plus/icons-vue")['Cpu']
    'ElIconCreditCard': typeof import("@element-plus/icons-vue")['CreditCard']
    'ElIconCrop': typeof import("@element-plus/icons-vue")['Crop']
    'ElIconDArrowLeft': typeof import("@element-plus/icons-vue")['DArrowLeft']
    'ElIconDArrowRight': typeof import("@element-plus/icons-vue")['DArrowRight']
    'ElIconDCaret': typeof import("@element-plus/icons-vue")['DCaret']
    'ElIconDataAnalysis': typeof import("@element-plus/icons-vue")['DataAnalysis']
    'ElIconDataBoard': typeof import("@element-plus/icons-vue")['DataBoard']
    'ElIconDataLine': typeof import("@element-plus/icons-vue")['DataLine']
    'ElIconDelete': typeof import("@element-plus/icons-vue")['Delete']
    'ElIconDeleteFilled': typeof import("@element-plus/icons-vue")['DeleteFilled']
    'ElIconDeleteLocation': typeof import("@element-plus/icons-vue")['DeleteLocation']
    'ElIconDessert': typeof import("@element-plus/icons-vue")['Dessert']
    'ElIconDiscount': typeof import("@element-plus/icons-vue")['Discount']
    'ElIconDish': typeof import("@element-plus/icons-vue")['Dish']
    'ElIconDishDot': typeof import("@element-plus/icons-vue")['DishDot']
    'ElIconDocument': typeof import("@element-plus/icons-vue")['Document']
    'ElIconDocumentAdd': typeof import("@element-plus/icons-vue")['DocumentAdd']
    'ElIconDocumentChecked': typeof import("@element-plus/icons-vue")['DocumentChecked']
    'ElIconDocumentCopy': typeof import("@element-plus/icons-vue")['DocumentCopy']
    'ElIconDocumentDelete': typeof import("@element-plus/icons-vue")['DocumentDelete']
    'ElIconDocumentRemove': typeof import("@element-plus/icons-vue")['DocumentRemove']
    'ElIconDownload': typeof import("@element-plus/icons-vue")['Download']
    'ElIconDrizzling': typeof import("@element-plus/icons-vue")['Drizzling']
    'ElIconEdit': typeof import("@element-plus/icons-vue")['Edit']
    'ElIconEditPen': typeof import("@element-plus/icons-vue")['EditPen']
    'ElIconEleme': typeof import("@element-plus/icons-vue")['Eleme']
    'ElIconElemeFilled': typeof import("@element-plus/icons-vue")['ElemeFilled']
    'ElIconElementPlus': typeof import("@element-plus/icons-vue")['ElementPlus']
    'ElIconExpand': typeof import("@element-plus/icons-vue")['Expand']
    'ElIconFailed': typeof import("@element-plus/icons-vue")['Failed']
    'ElIconFemale': typeof import("@element-plus/icons-vue")['Female']
    'ElIconFiles': typeof import("@element-plus/icons-vue")['Files']
    'ElIconFilm': typeof import("@element-plus/icons-vue")['Film']
    'ElIconFilter': typeof import("@element-plus/icons-vue")['Filter']
    'ElIconFinished': typeof import("@element-plus/icons-vue")['Finished']
    'ElIconFirstAidKit': typeof import("@element-plus/icons-vue")['FirstAidKit']
    'ElIconFlag': typeof import("@element-plus/icons-vue")['Flag']
    'ElIconFold': typeof import("@element-plus/icons-vue")['Fold']
    'ElIconFolder': typeof import("@element-plus/icons-vue")['Folder']
    'ElIconFolderAdd': typeof import("@element-plus/icons-vue")['FolderAdd']
    'ElIconFolderChecked': typeof import("@element-plus/icons-vue")['FolderChecked']
    'ElIconFolderDelete': typeof import("@element-plus/icons-vue")['FolderDelete']
    'ElIconFolderOpened': typeof import("@element-plus/icons-vue")['FolderOpened']
    'ElIconFolderRemove': typeof import("@element-plus/icons-vue")['FolderRemove']
    'ElIconFood': typeof import("@element-plus/icons-vue")['Food']
    'ElIconFootball': typeof import("@element-plus/icons-vue")['Football']
    'ElIconForkSpoon': typeof import("@element-plus/icons-vue")['ForkSpoon']
    'ElIconFries': typeof import("@element-plus/icons-vue")['Fries']
    'ElIconFullScreen': typeof import("@element-plus/icons-vue")['FullScreen']
    'ElIconGoblet': typeof import("@element-plus/icons-vue")['Goblet']
    'ElIconGobletFull': typeof import("@element-plus/icons-vue")['GobletFull']
    'ElIconGobletSquare': typeof import("@element-plus/icons-vue")['GobletSquare']
    'ElIconGobletSquareFull': typeof import("@element-plus/icons-vue")['GobletSquareFull']
    'ElIconGoldMedal': typeof import("@element-plus/icons-vue")['GoldMedal']
    'ElIconGoods': typeof import("@element-plus/icons-vue")['Goods']
    'ElIconGoodsFilled': typeof import("@element-plus/icons-vue")['GoodsFilled']
    'ElIconGrape': typeof import("@element-plus/icons-vue")['Grape']
    'ElIconGrid': typeof import("@element-plus/icons-vue")['Grid']
    'ElIconGuide': typeof import("@element-plus/icons-vue")['Guide']
    'ElIconHandbag': typeof import("@element-plus/icons-vue")['Handbag']
    'ElIconHeadset': typeof import("@element-plus/icons-vue")['Headset']
    'ElIconHelp': typeof import("@element-plus/icons-vue")['Help']
    'ElIconHelpFilled': typeof import("@element-plus/icons-vue")['HelpFilled']
    'ElIconHide': typeof import("@element-plus/icons-vue")['Hide']
    'ElIconHistogram': typeof import("@element-plus/icons-vue")['Histogram']
    'ElIconHomeFilled': typeof import("@element-plus/icons-vue")['HomeFilled']
    'ElIconHotWater': typeof import("@element-plus/icons-vue")['HotWater']
    'ElIconHouse': typeof import("@element-plus/icons-vue")['House']
    'ElIconIceCream': typeof import("@element-plus/icons-vue")['IceCream']
    'ElIconIceCreamRound': typeof import("@element-plus/icons-vue")['IceCreamRound']
    'ElIconIceCreamSquare': typeof import("@element-plus/icons-vue")['IceCreamSquare']
    'ElIconIceDrink': typeof import("@element-plus/icons-vue")['IceDrink']
    'ElIconIceTea': typeof import("@element-plus/icons-vue")['IceTea']
    'ElIconInfoFilled': typeof import("@element-plus/icons-vue")['InfoFilled']
    'ElIconIphone': typeof import("@element-plus/icons-vue")['Iphone']
    'ElIconKey': typeof import("@element-plus/icons-vue")['Key']
    'ElIconKnifeFork': typeof import("@element-plus/icons-vue")['KnifeFork']
    'ElIconLightning': typeof import("@element-plus/icons-vue")['Lightning']
    'ElIconLink': typeof import("@element-plus/icons-vue")['Link']
    'ElIconList': typeof import("@element-plus/icons-vue")['List']
    'ElIconLoading': typeof import("@element-plus/icons-vue")['Loading']
    'ElIconLocation': typeof import("@element-plus/icons-vue")['Location']
    'ElIconLocationFilled': typeof import("@element-plus/icons-vue")['LocationFilled']
    'ElIconLocationInformation': typeof import("@element-plus/icons-vue")['LocationInformation']
    'ElIconLock': typeof import("@element-plus/icons-vue")['Lock']
    'ElIconLollipop': typeof import("@element-plus/icons-vue")['Lollipop']
    'ElIconMagicStick': typeof import("@element-plus/icons-vue")['MagicStick']
    'ElIconMagnet': typeof import("@element-plus/icons-vue")['Magnet']
    'ElIconMale': typeof import("@element-plus/icons-vue")['Male']
    'ElIconManagement': typeof import("@element-plus/icons-vue")['Management']
    'ElIconMapLocation': typeof import("@element-plus/icons-vue")['MapLocation']
    'ElIconMedal': typeof import("@element-plus/icons-vue")['Medal']
    'ElIconMemo': typeof import("@element-plus/icons-vue")['Memo']
    'ElIconMenu': typeof import("@element-plus/icons-vue")['Menu']
    'ElIconMessage': typeof import("@element-plus/icons-vue")['Message']
    'ElIconMessageBox': typeof import("@element-plus/icons-vue")['MessageBox']
    'ElIconMic': typeof import("@element-plus/icons-vue")['Mic']
    'ElIconMicrophone': typeof import("@element-plus/icons-vue")['Microphone']
    'ElIconMilkTea': typeof import("@element-plus/icons-vue")['MilkTea']
    'ElIconMinus': typeof import("@element-plus/icons-vue")['Minus']
    'ElIconMoney': typeof import("@element-plus/icons-vue")['Money']
    'ElIconMonitor': typeof import("@element-plus/icons-vue")['Monitor']
    'ElIconMoon': typeof import("@element-plus/icons-vue")['Moon']
    'ElIconMoonNight': typeof import("@element-plus/icons-vue")['MoonNight']
    'ElIconMore': typeof import("@element-plus/icons-vue")['More']
    'ElIconMoreFilled': typeof import("@element-plus/icons-vue")['MoreFilled']
    'ElIconMostlyCloudy': typeof import("@element-plus/icons-vue")['MostlyCloudy']
    'ElIconMouse': typeof import("@element-plus/icons-vue")['Mouse']
    'ElIconMug': typeof import("@element-plus/icons-vue")['Mug']
    'ElIconMute': typeof import("@element-plus/icons-vue")['Mute']
    'ElIconMuteNotification': typeof import("@element-plus/icons-vue")['MuteNotification']
    'ElIconNoSmoking': typeof import("@element-plus/icons-vue")['NoSmoking']
    'ElIconNotebook': typeof import("@element-plus/icons-vue")['Notebook']
    'ElIconNotification': typeof import("@element-plus/icons-vue")['Notification']
    'ElIconOdometer': typeof import("@element-plus/icons-vue")['Odometer']
    'ElIconOfficeBuilding': typeof import("@element-plus/icons-vue")['OfficeBuilding']
    'ElIconOpen': typeof import("@element-plus/icons-vue")['Open']
    'ElIconOperation': typeof import("@element-plus/icons-vue")['Operation']
    'ElIconOpportunity': typeof import("@element-plus/icons-vue")['Opportunity']
    'ElIconOrange': typeof import("@element-plus/icons-vue")['Orange']
    'ElIconPaperclip': typeof import("@element-plus/icons-vue")['Paperclip']
    'ElIconPartlyCloudy': typeof import("@element-plus/icons-vue")['PartlyCloudy']
    'ElIconPear': typeof import("@element-plus/icons-vue")['Pear']
    'ElIconPhone': typeof import("@element-plus/icons-vue")['Phone']
    'ElIconPhoneFilled': typeof import("@element-plus/icons-vue")['PhoneFilled']
    'ElIconPicture': typeof import("@element-plus/icons-vue")['Picture']
    'ElIconPictureFilled': typeof import("@element-plus/icons-vue")['PictureFilled']
    'ElIconPictureRounded': typeof import("@element-plus/icons-vue")['PictureRounded']
    'ElIconPieChart': typeof import("@element-plus/icons-vue")['PieChart']
    'ElIconPlace': typeof import("@element-plus/icons-vue")['Place']
    'ElIconPlatform': typeof import("@element-plus/icons-vue")['Platform']
    'ElIconPlus': typeof import("@element-plus/icons-vue")['Plus']
    'ElIconPointer': typeof import("@element-plus/icons-vue")['Pointer']
    'ElIconPosition': typeof import("@element-plus/icons-vue")['Position']
    'ElIconPostcard': typeof import("@element-plus/icons-vue")['Postcard']
    'ElIconPouring': typeof import("@element-plus/icons-vue")['Pouring']
    'ElIconPresent': typeof import("@element-plus/icons-vue")['Present']
    'ElIconPriceTag': typeof import("@element-plus/icons-vue")['PriceTag']
    'ElIconPrinter': typeof import("@element-plus/icons-vue")['Printer']
    'ElIconPromotion': typeof import("@element-plus/icons-vue")['Promotion']
    'ElIconQuartzWatch': typeof import("@element-plus/icons-vue")['QuartzWatch']
    'ElIconQuestionFilled': typeof import("@element-plus/icons-vue")['QuestionFilled']
    'ElIconRank': typeof import("@element-plus/icons-vue")['Rank']
    'ElIconReading': typeof import("@element-plus/icons-vue")['Reading']
    'ElIconReadingLamp': typeof import("@element-plus/icons-vue")['ReadingLamp']
    'ElIconRefresh': typeof import("@element-plus/icons-vue")['Refresh']
    'ElIconRefreshLeft': typeof import("@element-plus/icons-vue")['RefreshLeft']
    'ElIconRefreshRight': typeof import("@element-plus/icons-vue")['RefreshRight']
    'ElIconRefrigerator': typeof import("@element-plus/icons-vue")['Refrigerator']
    'ElIconRemove': typeof import("@element-plus/icons-vue")['Remove']
    'ElIconRemoveFilled': typeof import("@element-plus/icons-vue")['RemoveFilled']
    'ElIconRight': typeof import("@element-plus/icons-vue")['Right']
    'ElIconScaleToOriginal': typeof import("@element-plus/icons-vue")['ScaleToOriginal']
    'ElIconSchool': typeof import("@element-plus/icons-vue")['School']
    'ElIconScissor': typeof import("@element-plus/icons-vue")['Scissor']
    'ElIconSearch': typeof import("@element-plus/icons-vue")['Search']
    'ElIconSelect': typeof import("@element-plus/icons-vue")['Select']
    'ElIconSell': typeof import("@element-plus/icons-vue")['Sell']
    'ElIconSemiSelect': typeof import("@element-plus/icons-vue")['SemiSelect']
    'ElIconService': typeof import("@element-plus/icons-vue")['Service']
    'ElIconSetUp': typeof import("@element-plus/icons-vue")['SetUp']
    'ElIconSetting': typeof import("@element-plus/icons-vue")['Setting']
    'ElIconShare': typeof import("@element-plus/icons-vue")['Share']
    'ElIconShip': typeof import("@element-plus/icons-vue")['Ship']
    'ElIconShop': typeof import("@element-plus/icons-vue")['Shop']
    'ElIconShoppingBag': typeof import("@element-plus/icons-vue")['ShoppingBag']
    'ElIconShoppingCart': typeof import("@element-plus/icons-vue")['ShoppingCart']
    'ElIconShoppingCartFull': typeof import("@element-plus/icons-vue")['ShoppingCartFull']
    'ElIconShoppingTrolley': typeof import("@element-plus/icons-vue")['ShoppingTrolley']
    'ElIconSmoking': typeof import("@element-plus/icons-vue")['Smoking']
    'ElIconSoccer': typeof import("@element-plus/icons-vue")['Soccer']
    'ElIconSoldOut': typeof import("@element-plus/icons-vue")['SoldOut']
    'ElIconSort': typeof import("@element-plus/icons-vue")['Sort']
    'ElIconSortDown': typeof import("@element-plus/icons-vue")['SortDown']
    'ElIconSortUp': typeof import("@element-plus/icons-vue")['SortUp']
    'ElIconStamp': typeof import("@element-plus/icons-vue")['Stamp']
    'ElIconStar': typeof import("@element-plus/icons-vue")['Star']
    'ElIconStarFilled': typeof import("@element-plus/icons-vue")['StarFilled']
    'ElIconStopwatch': typeof import("@element-plus/icons-vue")['Stopwatch']
    'ElIconSuccessFilled': typeof import("@element-plus/icons-vue")['SuccessFilled']
    'ElIconSugar': typeof import("@element-plus/icons-vue")['Sugar']
    'ElIconSuitcase': typeof import("@element-plus/icons-vue")['Suitcase']
    'ElIconSuitcaseLine': typeof import("@element-plus/icons-vue")['SuitcaseLine']
    'ElIconSunny': typeof import("@element-plus/icons-vue")['Sunny']
    'ElIconSunrise': typeof import("@element-plus/icons-vue")['Sunrise']
    'ElIconSunset': typeof import("@element-plus/icons-vue")['Sunset']
    'ElIconSwitch': typeof import("@element-plus/icons-vue")['Switch']
    'ElIconSwitchButton': typeof import("@element-plus/icons-vue")['SwitchButton']
    'ElIconSwitchFilled': typeof import("@element-plus/icons-vue")['SwitchFilled']
    'ElIconTakeawayBox': typeof import("@element-plus/icons-vue")['TakeawayBox']
    'ElIconTicket': typeof import("@element-plus/icons-vue")['Ticket']
    'ElIconTickets': typeof import("@element-plus/icons-vue")['Tickets']
    'ElIconTimer': typeof import("@element-plus/icons-vue")['Timer']
    'ElIconToiletPaper': typeof import("@element-plus/icons-vue")['ToiletPaper']
    'ElIconTools': typeof import("@element-plus/icons-vue")['Tools']
    'ElIconTop': typeof import("@element-plus/icons-vue")['Top']
    'ElIconTopLeft': typeof import("@element-plus/icons-vue")['TopLeft']
    'ElIconTopRight': typeof import("@element-plus/icons-vue")['TopRight']
    'ElIconTrendCharts': typeof import("@element-plus/icons-vue")['TrendCharts']
    'ElIconTrophy': typeof import("@element-plus/icons-vue")['Trophy']
    'ElIconTrophyBase': typeof import("@element-plus/icons-vue")['TrophyBase']
    'ElIconTurnOff': typeof import("@element-plus/icons-vue")['TurnOff']
    'ElIconUmbrella': typeof import("@element-plus/icons-vue")['Umbrella']
    'ElIconUnlock': typeof import("@element-plus/icons-vue")['Unlock']
    'ElIconUpload': typeof import("@element-plus/icons-vue")['Upload']
    'ElIconUploadFilled': typeof import("@element-plus/icons-vue")['UploadFilled']
    'ElIconUser': typeof import("@element-plus/icons-vue")['User']
    'ElIconUserFilled': typeof import("@element-plus/icons-vue")['UserFilled']
    'ElIconVan': typeof import("@element-plus/icons-vue")['Van']
    'ElIconVideoCamera': typeof import("@element-plus/icons-vue")['VideoCamera']
    'ElIconVideoCameraFilled': typeof import("@element-plus/icons-vue")['VideoCameraFilled']
    'ElIconVideoPause': typeof import("@element-plus/icons-vue")['VideoPause']
    'ElIconVideoPlay': typeof import("@element-plus/icons-vue")['VideoPlay']
    'ElIconView': typeof import("@element-plus/icons-vue")['View']
    'ElIconWallet': typeof import("@element-plus/icons-vue")['Wallet']
    'ElIconWalletFilled': typeof import("@element-plus/icons-vue")['WalletFilled']
    'ElIconWarnTriangleFilled': typeof import("@element-plus/icons-vue")['WarnTriangleFilled']
    'ElIconWarning': typeof import("@element-plus/icons-vue")['Warning']
    'ElIconWarningFilled': typeof import("@element-plus/icons-vue")['WarningFilled']
    'ElIconWatch': typeof import("@element-plus/icons-vue")['Watch']
    'ElIconWatermelon': typeof import("@element-plus/icons-vue")['Watermelon']
    'ElIconWindPower': typeof import("@element-plus/icons-vue")['WindPower']
    'ElIconZoomIn': typeof import("@element-plus/icons-vue")['ZoomIn']
    'ElIconZoomOut': typeof import("@element-plus/icons-vue")['ZoomOut']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazyAccountOrder': LazyComponent<typeof import("../components/Account/Order.vue")['default']>
    'LazyAccountWechat': LazyComponent<typeof import("../components/Account/Wechat.vue")['default']>
    'LazyCommonAiAssistant': LazyComponent<typeof import("../components/Common/AiAssistant.vue")['default']>
    'LazyCommonFooter': LazyComponent<typeof import("../components/Common/Footer.vue")['default']>
    'LazyCommonHeader': LazyComponent<typeof import("../components/Common/Header.vue")['default']>
    'LazyCommonLink': LazyComponent<typeof import("../components/Common/Link.vue")['default']>
    'LazyCommonPagination': LazyComponent<typeof import("../components/Common/Pagination.vue")['default']>
    'LazyCommonPay': LazyComponent<typeof import("../components/Common/Pay.vue")['default']>
    'LazyCommonPdfViewer': LazyComponent<typeof import("../components/Common/PdfViewer.vue")['default']>
    'LazyCommonRichTextEditor': LazyComponent<typeof import("../components/Common/RichTextEditor.vue")['default']>
    'LazyCommonUser': LazyComponent<typeof import("../components/Common/User.vue")['default']>
    'LazyCourseChapter': LazyComponent<typeof import("../components/Course/Chapter.vue")['default']>
    'LazyCourseChoose': LazyComponent<typeof import("../components/Course/Choose.vue")['default']>
    'LazyCourseCollect': LazyComponent<typeof import("../components/Course/Collect.vue")['default']>
    'LazyCourseCommentList': LazyComponent<typeof import("../components/Course/CommentList.vue")['default']>
    'LazyCourseAI': LazyComponent<typeof import("../components/Course/CourseAI.vue")['default']>
    'LazyCourseExam': LazyComponent<typeof import("../components/Course/CourseExam.vue")['default']>
    'LazyCourseHomework': LazyComponent<typeof import("../components/Course/CourseHomework.vue")['default']>
    'LazyCourseList': LazyComponent<typeof import("../components/Course/List.vue")['default']>
    'LazyCourseNoteList': LazyComponent<typeof import("../components/Course/NoteList.vue")['default']>
    'LazyCourseProgressTracker': LazyComponent<typeof import("../components/Course/ProgressTracker.vue")['default']>
    'LazyCourseVideoPlayer': LazyComponent<typeof import("../components/Course/VideoPlayer.vue")['default']>
    'LazyLecturerList': LazyComponent<typeof import("../components/Lecturer/List.vue")['default']>
    'LazyWorksWorkUpload': LazyComponent<typeof import("../components/Works/WorkUpload.vue")['default']>
    'LazyWorksWorkWall': LazyComponent<typeof import("../components/Works/WorkWall.vue")['default']>
    'LazyZoneCategory': LazyComponent<typeof import("../components/Zone/Category.vue")['default']>
    'LazyZoneCourse': LazyComponent<typeof import("../components/Zone/Course.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyElAffix': LazyComponent<typeof import("element-plus/es/components/affix/index")['ElAffix']>
    'LazyElAlert': LazyComponent<typeof import("element-plus/es/components/alert/index")['ElAlert']>
    'LazyElAutocomplete': LazyComponent<typeof import("element-plus/es/components/autocomplete/index")['ElAutocomplete']>
    'LazyElAutoResizer': LazyComponent<typeof import("element-plus/es/components/table-v2/index")['ElAutoResizer']>
    'LazyElAvatar': LazyComponent<typeof import("element-plus/es/components/avatar/index")['ElAvatar']>
    'LazyElBacktop': LazyComponent<typeof import("element-plus/es/components/backtop/index")['ElBacktop']>
    'LazyElBadge': LazyComponent<typeof import("element-plus/es/components/badge/index")['ElBadge']>
    'LazyElBreadcrumb': LazyComponent<typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumb']>
    'LazyElBreadcrumbItem': LazyComponent<typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumbItem']>
    'LazyElButton': LazyComponent<typeof import("element-plus/es/components/button/index")['ElButton']>
    'LazyElButtonGroup': LazyComponent<typeof import("element-plus/es/components/button/index")['ElButtonGroup']>
    'LazyElCalendar': LazyComponent<typeof import("element-plus/es/components/calendar/index")['ElCalendar']>
    'LazyElCard': LazyComponent<typeof import("element-plus/es/components/card/index")['ElCard']>
    'LazyElCarousel': LazyComponent<typeof import("element-plus/es/components/carousel/index")['ElCarousel']>
    'LazyElCarouselItem': LazyComponent<typeof import("element-plus/es/components/carousel/index")['ElCarouselItem']>
    'LazyElCascader': LazyComponent<typeof import("element-plus/es/components/cascader/index")['ElCascader']>
    'LazyElCascaderPanel': LazyComponent<typeof import("element-plus/es/components/cascader-panel/index")['ElCascaderPanel']>
    'LazyElCheckTag': LazyComponent<typeof import("element-plus/es/components/check-tag/index")['ElCheckTag']>
    'LazyElCheckbox': LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckbox']>
    'LazyElCheckboxButton': LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckboxButton']>
    'LazyElCheckboxGroup': LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckboxGroup']>
    'LazyElCol': LazyComponent<typeof import("element-plus/es/components/col/index")['ElCol']>
    'LazyElCollapse': LazyComponent<typeof import("element-plus/es/components/collapse/index")['ElCollapse']>
    'LazyElCollapseItem': LazyComponent<typeof import("element-plus/es/components/collapse/index")['ElCollapseItem']>
    'LazyElCollapseTransition': LazyComponent<typeof import("element-plus/es/components/collapse-transition/index")['ElCollapseTransition']>
    'LazyElColorPicker': LazyComponent<typeof import("element-plus/es/components/color-picker/index")['ElColorPicker']>
    'LazyElConfigProvider': LazyComponent<typeof import("element-plus/es/components/config-provider/index")['ElConfigProvider']>
    'LazyElContainer': LazyComponent<typeof import("element-plus/es/components/container/index")['ElContainer']>
    'LazyElAside': LazyComponent<typeof import("element-plus/es/components/container/index")['ElAside']>
    'LazyElFooter': LazyComponent<typeof import("element-plus/es/components/container/index")['ElFooter']>
    'LazyElHeader': LazyComponent<typeof import("element-plus/es/components/container/index")['ElHeader']>
    'LazyElMain': LazyComponent<typeof import("element-plus/es/components/container/index")['ElMain']>
    'LazyElDatePicker': LazyComponent<typeof import("element-plus/es/components/date-picker/index")['ElDatePicker']>
    'LazyElDescriptions': LazyComponent<typeof import("element-plus/es/components/descriptions/index")['ElDescriptions']>
    'LazyElDescriptionsItem': LazyComponent<typeof import("element-plus/es/components/descriptions/index")['ElDescriptionsItem']>
    'LazyElDialog': LazyComponent<typeof import("element-plus/es/components/dialog/index")['ElDialog']>
    'LazyElDivider': LazyComponent<typeof import("element-plus/es/components/divider/index")['ElDivider']>
    'LazyElDrawer': LazyComponent<typeof import("element-plus/es/components/drawer/index")['ElDrawer']>
    'LazyElDropdown': LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdown']>
    'LazyElDropdownItem': LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdownItem']>
    'LazyElDropdownMenu': LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdownMenu']>
    'LazyElEmpty': LazyComponent<typeof import("element-plus/es/components/empty/index")['ElEmpty']>
    'LazyElForm': LazyComponent<typeof import("element-plus/es/components/form/index")['ElForm']>
    'LazyElFormItem': LazyComponent<typeof import("element-plus/es/components/form/index")['ElFormItem']>
    'LazyElIcon': LazyComponent<typeof import("element-plus/es/components/icon/index")['ElIcon']>
    'LazyElImage': LazyComponent<typeof import("element-plus/es/components/image/index")['ElImage']>
    'LazyElImageViewer': LazyComponent<typeof import("element-plus/es/components/image-viewer/index")['ElImageViewer']>
    'LazyElInput': LazyComponent<typeof import("element-plus/es/components/input/index")['ElInput']>
    'LazyElInputNumber': LazyComponent<typeof import("element-plus/es/components/input-number/index")['ElInputNumber']>
    'LazyElInputTag': LazyComponent<typeof import("element-plus/es/components/input-tag/index")['ElInputTag']>
    'LazyElLink': LazyComponent<typeof import("element-plus/es/components/link/index")['ElLink']>
    'LazyElMenu': LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenu']>
    'LazyElMenuItem': LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenuItem']>
    'LazyElMenuItemGroup': LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenuItemGroup']>
    'LazyElSubMenu': LazyComponent<typeof import("element-plus/es/components/menu/index")['ElSubMenu']>
    'LazyElPageHeader': LazyComponent<typeof import("element-plus/es/components/page-header/index")['ElPageHeader']>
    'LazyElPagination': LazyComponent<typeof import("element-plus/es/components/pagination/index")['ElPagination']>
    'LazyElPopconfirm': LazyComponent<typeof import("element-plus/es/components/popconfirm/index")['ElPopconfirm']>
    'LazyElPopover': LazyComponent<typeof import("element-plus/es/components/popover/index")['ElPopover']>
    'LazyElPopper': LazyComponent<typeof import("element-plus/es/components/popper/index")['ElPopper']>
    'LazyElProgress': LazyComponent<typeof import("element-plus/es/components/progress/index")['ElProgress']>
    'LazyElRadio': LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadio']>
    'LazyElRadioButton': LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadioButton']>
    'LazyElRadioGroup': LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadioGroup']>
    'LazyElRate': LazyComponent<typeof import("element-plus/es/components/rate/index")['ElRate']>
    'LazyElResult': LazyComponent<typeof import("element-plus/es/components/result/index")['ElResult']>
    'LazyElRow': LazyComponent<typeof import("element-plus/es/components/row/index")['ElRow']>
    'LazyElScrollbar': LazyComponent<typeof import("element-plus/es/components/scrollbar/index")['ElScrollbar']>
    'LazyElSelect': LazyComponent<typeof import("element-plus/es/components/select/index")['ElSelect']>
    'LazyElOption': LazyComponent<typeof import("element-plus/es/components/select/index")['ElOption']>
    'LazyElOptionGroup': LazyComponent<typeof import("element-plus/es/components/select/index")['ElOptionGroup']>
    'LazyElSelectV2': LazyComponent<typeof import("element-plus/es/components/select-v2/index")['ElSelectV2']>
    'LazyElSkeleton': LazyComponent<typeof import("element-plus/es/components/skeleton/index")['ElSkeleton']>
    'LazyElSkeletonItem': LazyComponent<typeof import("element-plus/es/components/skeleton/index")['ElSkeletonItem']>
    'LazyElSlider': LazyComponent<typeof import("element-plus/es/components/slider/index")['ElSlider']>
    'LazyElSpace': LazyComponent<typeof import("element-plus/es/components/space/index")['ElSpace']>
    'LazyElStatistic': LazyComponent<typeof import("element-plus/es/components/statistic/index")['ElStatistic']>
    'LazyElCountdown': LazyComponent<typeof import("element-plus/es/components/countdown/index")['ElCountdown']>
    'LazyElSteps': LazyComponent<typeof import("element-plus/es/components/steps/index")['ElSteps']>
    'LazyElStep': LazyComponent<typeof import("element-plus/es/components/steps/index")['ElStep']>
    'LazyElSwitch': LazyComponent<typeof import("element-plus/es/components/switch/index")['ElSwitch']>
    'LazyElTable': LazyComponent<typeof import("element-plus/es/components/table/index")['ElTable']>
    'LazyElTableColumn': LazyComponent<typeof import("element-plus/es/components/table/index")['ElTableColumn']>
    'LazyElTableV2': LazyComponent<typeof import("element-plus/es/components/table-v2/index")['ElTableV2']>
    'LazyElTabs': LazyComponent<typeof import("element-plus/es/components/tabs/index")['ElTabs']>
    'LazyElTabPane': LazyComponent<typeof import("element-plus/es/components/tabs/index")['ElTabPane']>
    'LazyElTag': LazyComponent<typeof import("element-plus/es/components/tag/index")['ElTag']>
    'LazyElText': LazyComponent<typeof import("element-plus/es/components/text/index")['ElText']>
    'LazyElTimePicker': LazyComponent<typeof import("element-plus/es/components/time-picker/index")['ElTimePicker']>
    'LazyElTimeSelect': LazyComponent<typeof import("element-plus/es/components/time-select/index")['ElTimeSelect']>
    'LazyElTimeline': LazyComponent<typeof import("element-plus/es/components/timeline/index")['ElTimeline']>
    'LazyElTimelineItem': LazyComponent<typeof import("element-plus/es/components/timeline/index")['ElTimelineItem']>
    'LazyElTooltip': LazyComponent<typeof import("element-plus/es/components/tooltip/index")['ElTooltip']>
    'LazyElTooltipV2': LazyComponent<typeof import("element-plus/es/components/tooltip-v2/index")['ElTooltipV2']>
    'LazyElTransfer': LazyComponent<typeof import("element-plus/es/components/transfer/index")['ElTransfer']>
    'LazyElTree': LazyComponent<typeof import("element-plus/es/components/tree/index")['ElTree']>
    'LazyElTreeSelect': LazyComponent<typeof import("element-plus/es/components/tree-select/index")['ElTreeSelect']>
    'LazyElTreeV2': LazyComponent<typeof import("element-plus/es/components/tree-v2/index")['ElTreeV2']>
    'LazyElUpload': LazyComponent<typeof import("element-plus/es/components/upload/index")['ElUpload']>
    'LazyElWatermark': LazyComponent<typeof import("element-plus/es/components/watermark/index")['ElWatermark']>
    'LazyElTour': LazyComponent<typeof import("element-plus/es/components/tour/index")['ElTour']>
    'LazyElTourStep': LazyComponent<typeof import("element-plus/es/components/tour/index")['ElTourStep']>
    'LazyElAnchor': LazyComponent<typeof import("element-plus/es/components/anchor/index")['ElAnchor']>
    'LazyElAnchorLink': LazyComponent<typeof import("element-plus/es/components/anchor/index")['ElAnchorLink']>
    'LazyElSegmented': LazyComponent<typeof import("element-plus/es/components/segmented/index")['ElSegmented']>
    'LazyElMention': LazyComponent<typeof import("element-plus/es/components/mention/index")['ElMention']>
    'LazyElIconAddLocation': LazyComponent<typeof import("@element-plus/icons-vue")['AddLocation']>
    'LazyElIconAim': LazyComponent<typeof import("@element-plus/icons-vue")['Aim']>
    'LazyElIconAlarmClock': LazyComponent<typeof import("@element-plus/icons-vue")['AlarmClock']>
    'LazyElIconApple': LazyComponent<typeof import("@element-plus/icons-vue")['Apple']>
    'LazyElIconArrowDown': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowDown']>
    'LazyElIconArrowDownBold': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowDownBold']>
    'LazyElIconArrowLeft': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowLeft']>
    'LazyElIconArrowLeftBold': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowLeftBold']>
    'LazyElIconArrowRight': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowRight']>
    'LazyElIconArrowRightBold': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowRightBold']>
    'LazyElIconArrowUp': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowUp']>
    'LazyElIconArrowUpBold': LazyComponent<typeof import("@element-plus/icons-vue")['ArrowUpBold']>
    'LazyElIconAvatar': LazyComponent<typeof import("@element-plus/icons-vue")['Avatar']>
    'LazyElIconBack': LazyComponent<typeof import("@element-plus/icons-vue")['Back']>
    'LazyElIconBaseball': LazyComponent<typeof import("@element-plus/icons-vue")['Baseball']>
    'LazyElIconBasketball': LazyComponent<typeof import("@element-plus/icons-vue")['Basketball']>
    'LazyElIconBell': LazyComponent<typeof import("@element-plus/icons-vue")['Bell']>
    'LazyElIconBellFilled': LazyComponent<typeof import("@element-plus/icons-vue")['BellFilled']>
    'LazyElIconBicycle': LazyComponent<typeof import("@element-plus/icons-vue")['Bicycle']>
    'LazyElIconBottom': LazyComponent<typeof import("@element-plus/icons-vue")['Bottom']>
    'LazyElIconBottomLeft': LazyComponent<typeof import("@element-plus/icons-vue")['BottomLeft']>
    'LazyElIconBottomRight': LazyComponent<typeof import("@element-plus/icons-vue")['BottomRight']>
    'LazyElIconBowl': LazyComponent<typeof import("@element-plus/icons-vue")['Bowl']>
    'LazyElIconBox': LazyComponent<typeof import("@element-plus/icons-vue")['Box']>
    'LazyElIconBriefcase': LazyComponent<typeof import("@element-plus/icons-vue")['Briefcase']>
    'LazyElIconBrush': LazyComponent<typeof import("@element-plus/icons-vue")['Brush']>
    'LazyElIconBrushFilled': LazyComponent<typeof import("@element-plus/icons-vue")['BrushFilled']>
    'LazyElIconBurger': LazyComponent<typeof import("@element-plus/icons-vue")['Burger']>
    'LazyElIconCalendar': LazyComponent<typeof import("@element-plus/icons-vue")['Calendar']>
    'LazyElIconCamera': LazyComponent<typeof import("@element-plus/icons-vue")['Camera']>
    'LazyElIconCameraFilled': LazyComponent<typeof import("@element-plus/icons-vue")['CameraFilled']>
    'LazyElIconCaretBottom': LazyComponent<typeof import("@element-plus/icons-vue")['CaretBottom']>
    'LazyElIconCaretLeft': LazyComponent<typeof import("@element-plus/icons-vue")['CaretLeft']>
    'LazyElIconCaretRight': LazyComponent<typeof import("@element-plus/icons-vue")['CaretRight']>
    'LazyElIconCaretTop': LazyComponent<typeof import("@element-plus/icons-vue")['CaretTop']>
    'LazyElIconCellphone': LazyComponent<typeof import("@element-plus/icons-vue")['Cellphone']>
    'LazyElIconChatDotRound': LazyComponent<typeof import("@element-plus/icons-vue")['ChatDotRound']>
    'LazyElIconChatDotSquare': LazyComponent<typeof import("@element-plus/icons-vue")['ChatDotSquare']>
    'LazyElIconChatLineRound': LazyComponent<typeof import("@element-plus/icons-vue")['ChatLineRound']>
    'LazyElIconChatLineSquare': LazyComponent<typeof import("@element-plus/icons-vue")['ChatLineSquare']>
    'LazyElIconChatRound': LazyComponent<typeof import("@element-plus/icons-vue")['ChatRound']>
    'LazyElIconChatSquare': LazyComponent<typeof import("@element-plus/icons-vue")['ChatSquare']>
    'LazyElIconCheck': LazyComponent<typeof import("@element-plus/icons-vue")['Check']>
    'LazyElIconChecked': LazyComponent<typeof import("@element-plus/icons-vue")['Checked']>
    'LazyElIconCherry': LazyComponent<typeof import("@element-plus/icons-vue")['Cherry']>
    'LazyElIconChicken': LazyComponent<typeof import("@element-plus/icons-vue")['Chicken']>
    'LazyElIconChromeFilled': LazyComponent<typeof import("@element-plus/icons-vue")['ChromeFilled']>
    'LazyElIconCircleCheck': LazyComponent<typeof import("@element-plus/icons-vue")['CircleCheck']>
    'LazyElIconCircleCheckFilled': LazyComponent<typeof import("@element-plus/icons-vue")['CircleCheckFilled']>
    'LazyElIconCircleClose': LazyComponent<typeof import("@element-plus/icons-vue")['CircleClose']>
    'LazyElIconCircleCloseFilled': LazyComponent<typeof import("@element-plus/icons-vue")['CircleCloseFilled']>
    'LazyElIconCirclePlus': LazyComponent<typeof import("@element-plus/icons-vue")['CirclePlus']>
    'LazyElIconCirclePlusFilled': LazyComponent<typeof import("@element-plus/icons-vue")['CirclePlusFilled']>
    'LazyElIconClock': LazyComponent<typeof import("@element-plus/icons-vue")['Clock']>
    'LazyElIconClose': LazyComponent<typeof import("@element-plus/icons-vue")['Close']>
    'LazyElIconCloseBold': LazyComponent<typeof import("@element-plus/icons-vue")['CloseBold']>
    'LazyElIconCloudy': LazyComponent<typeof import("@element-plus/icons-vue")['Cloudy']>
    'LazyElIconCoffee': LazyComponent<typeof import("@element-plus/icons-vue")['Coffee']>
    'LazyElIconCoffeeCup': LazyComponent<typeof import("@element-plus/icons-vue")['CoffeeCup']>
    'LazyElIconCoin': LazyComponent<typeof import("@element-plus/icons-vue")['Coin']>
    'LazyElIconColdDrink': LazyComponent<typeof import("@element-plus/icons-vue")['ColdDrink']>
    'LazyElIconCollection': LazyComponent<typeof import("@element-plus/icons-vue")['Collection']>
    'LazyElIconCollectionTag': LazyComponent<typeof import("@element-plus/icons-vue")['CollectionTag']>
    'LazyElIconComment': LazyComponent<typeof import("@element-plus/icons-vue")['Comment']>
    'LazyElIconCompass': LazyComponent<typeof import("@element-plus/icons-vue")['Compass']>
    'LazyElIconConnection': LazyComponent<typeof import("@element-plus/icons-vue")['Connection']>
    'LazyElIconCoordinate': LazyComponent<typeof import("@element-plus/icons-vue")['Coordinate']>
    'LazyElIconCopyDocument': LazyComponent<typeof import("@element-plus/icons-vue")['CopyDocument']>
    'LazyElIconCpu': LazyComponent<typeof import("@element-plus/icons-vue")['Cpu']>
    'LazyElIconCreditCard': LazyComponent<typeof import("@element-plus/icons-vue")['CreditCard']>
    'LazyElIconCrop': LazyComponent<typeof import("@element-plus/icons-vue")['Crop']>
    'LazyElIconDArrowLeft': LazyComponent<typeof import("@element-plus/icons-vue")['DArrowLeft']>
    'LazyElIconDArrowRight': LazyComponent<typeof import("@element-plus/icons-vue")['DArrowRight']>
    'LazyElIconDCaret': LazyComponent<typeof import("@element-plus/icons-vue")['DCaret']>
    'LazyElIconDataAnalysis': LazyComponent<typeof import("@element-plus/icons-vue")['DataAnalysis']>
    'LazyElIconDataBoard': LazyComponent<typeof import("@element-plus/icons-vue")['DataBoard']>
    'LazyElIconDataLine': LazyComponent<typeof import("@element-plus/icons-vue")['DataLine']>
    'LazyElIconDelete': LazyComponent<typeof import("@element-plus/icons-vue")['Delete']>
    'LazyElIconDeleteFilled': LazyComponent<typeof import("@element-plus/icons-vue")['DeleteFilled']>
    'LazyElIconDeleteLocation': LazyComponent<typeof import("@element-plus/icons-vue")['DeleteLocation']>
    'LazyElIconDessert': LazyComponent<typeof import("@element-plus/icons-vue")['Dessert']>
    'LazyElIconDiscount': LazyComponent<typeof import("@element-plus/icons-vue")['Discount']>
    'LazyElIconDish': LazyComponent<typeof import("@element-plus/icons-vue")['Dish']>
    'LazyElIconDishDot': LazyComponent<typeof import("@element-plus/icons-vue")['DishDot']>
    'LazyElIconDocument': LazyComponent<typeof import("@element-plus/icons-vue")['Document']>
    'LazyElIconDocumentAdd': LazyComponent<typeof import("@element-plus/icons-vue")['DocumentAdd']>
    'LazyElIconDocumentChecked': LazyComponent<typeof import("@element-plus/icons-vue")['DocumentChecked']>
    'LazyElIconDocumentCopy': LazyComponent<typeof import("@element-plus/icons-vue")['DocumentCopy']>
    'LazyElIconDocumentDelete': LazyComponent<typeof import("@element-plus/icons-vue")['DocumentDelete']>
    'LazyElIconDocumentRemove': LazyComponent<typeof import("@element-plus/icons-vue")['DocumentRemove']>
    'LazyElIconDownload': LazyComponent<typeof import("@element-plus/icons-vue")['Download']>
    'LazyElIconDrizzling': LazyComponent<typeof import("@element-plus/icons-vue")['Drizzling']>
    'LazyElIconEdit': LazyComponent<typeof import("@element-plus/icons-vue")['Edit']>
    'LazyElIconEditPen': LazyComponent<typeof import("@element-plus/icons-vue")['EditPen']>
    'LazyElIconEleme': LazyComponent<typeof import("@element-plus/icons-vue")['Eleme']>
    'LazyElIconElemeFilled': LazyComponent<typeof import("@element-plus/icons-vue")['ElemeFilled']>
    'LazyElIconElementPlus': LazyComponent<typeof import("@element-plus/icons-vue")['ElementPlus']>
    'LazyElIconExpand': LazyComponent<typeof import("@element-plus/icons-vue")['Expand']>
    'LazyElIconFailed': LazyComponent<typeof import("@element-plus/icons-vue")['Failed']>
    'LazyElIconFemale': LazyComponent<typeof import("@element-plus/icons-vue")['Female']>
    'LazyElIconFiles': LazyComponent<typeof import("@element-plus/icons-vue")['Files']>
    'LazyElIconFilm': LazyComponent<typeof import("@element-plus/icons-vue")['Film']>
    'LazyElIconFilter': LazyComponent<typeof import("@element-plus/icons-vue")['Filter']>
    'LazyElIconFinished': LazyComponent<typeof import("@element-plus/icons-vue")['Finished']>
    'LazyElIconFirstAidKit': LazyComponent<typeof import("@element-plus/icons-vue")['FirstAidKit']>
    'LazyElIconFlag': LazyComponent<typeof import("@element-plus/icons-vue")['Flag']>
    'LazyElIconFold': LazyComponent<typeof import("@element-plus/icons-vue")['Fold']>
    'LazyElIconFolder': LazyComponent<typeof import("@element-plus/icons-vue")['Folder']>
    'LazyElIconFolderAdd': LazyComponent<typeof import("@element-plus/icons-vue")['FolderAdd']>
    'LazyElIconFolderChecked': LazyComponent<typeof import("@element-plus/icons-vue")['FolderChecked']>
    'LazyElIconFolderDelete': LazyComponent<typeof import("@element-plus/icons-vue")['FolderDelete']>
    'LazyElIconFolderOpened': LazyComponent<typeof import("@element-plus/icons-vue")['FolderOpened']>
    'LazyElIconFolderRemove': LazyComponent<typeof import("@element-plus/icons-vue")['FolderRemove']>
    'LazyElIconFood': LazyComponent<typeof import("@element-plus/icons-vue")['Food']>
    'LazyElIconFootball': LazyComponent<typeof import("@element-plus/icons-vue")['Football']>
    'LazyElIconForkSpoon': LazyComponent<typeof import("@element-plus/icons-vue")['ForkSpoon']>
    'LazyElIconFries': LazyComponent<typeof import("@element-plus/icons-vue")['Fries']>
    'LazyElIconFullScreen': LazyComponent<typeof import("@element-plus/icons-vue")['FullScreen']>
    'LazyElIconGoblet': LazyComponent<typeof import("@element-plus/icons-vue")['Goblet']>
    'LazyElIconGobletFull': LazyComponent<typeof import("@element-plus/icons-vue")['GobletFull']>
    'LazyElIconGobletSquare': LazyComponent<typeof import("@element-plus/icons-vue")['GobletSquare']>
    'LazyElIconGobletSquareFull': LazyComponent<typeof import("@element-plus/icons-vue")['GobletSquareFull']>
    'LazyElIconGoldMedal': LazyComponent<typeof import("@element-plus/icons-vue")['GoldMedal']>
    'LazyElIconGoods': LazyComponent<typeof import("@element-plus/icons-vue")['Goods']>
    'LazyElIconGoodsFilled': LazyComponent<typeof import("@element-plus/icons-vue")['GoodsFilled']>
    'LazyElIconGrape': LazyComponent<typeof import("@element-plus/icons-vue")['Grape']>
    'LazyElIconGrid': LazyComponent<typeof import("@element-plus/icons-vue")['Grid']>
    'LazyElIconGuide': LazyComponent<typeof import("@element-plus/icons-vue")['Guide']>
    'LazyElIconHandbag': LazyComponent<typeof import("@element-plus/icons-vue")['Handbag']>
    'LazyElIconHeadset': LazyComponent<typeof import("@element-plus/icons-vue")['Headset']>
    'LazyElIconHelp': LazyComponent<typeof import("@element-plus/icons-vue")['Help']>
    'LazyElIconHelpFilled': LazyComponent<typeof import("@element-plus/icons-vue")['HelpFilled']>
    'LazyElIconHide': LazyComponent<typeof import("@element-plus/icons-vue")['Hide']>
    'LazyElIconHistogram': LazyComponent<typeof import("@element-plus/icons-vue")['Histogram']>
    'LazyElIconHomeFilled': LazyComponent<typeof import("@element-plus/icons-vue")['HomeFilled']>
    'LazyElIconHotWater': LazyComponent<typeof import("@element-plus/icons-vue")['HotWater']>
    'LazyElIconHouse': LazyComponent<typeof import("@element-plus/icons-vue")['House']>
    'LazyElIconIceCream': LazyComponent<typeof import("@element-plus/icons-vue")['IceCream']>
    'LazyElIconIceCreamRound': LazyComponent<typeof import("@element-plus/icons-vue")['IceCreamRound']>
    'LazyElIconIceCreamSquare': LazyComponent<typeof import("@element-plus/icons-vue")['IceCreamSquare']>
    'LazyElIconIceDrink': LazyComponent<typeof import("@element-plus/icons-vue")['IceDrink']>
    'LazyElIconIceTea': LazyComponent<typeof import("@element-plus/icons-vue")['IceTea']>
    'LazyElIconInfoFilled': LazyComponent<typeof import("@element-plus/icons-vue")['InfoFilled']>
    'LazyElIconIphone': LazyComponent<typeof import("@element-plus/icons-vue")['Iphone']>
    'LazyElIconKey': LazyComponent<typeof import("@element-plus/icons-vue")['Key']>
    'LazyElIconKnifeFork': LazyComponent<typeof import("@element-plus/icons-vue")['KnifeFork']>
    'LazyElIconLightning': LazyComponent<typeof import("@element-plus/icons-vue")['Lightning']>
    'LazyElIconLink': LazyComponent<typeof import("@element-plus/icons-vue")['Link']>
    'LazyElIconList': LazyComponent<typeof import("@element-plus/icons-vue")['List']>
    'LazyElIconLoading': LazyComponent<typeof import("@element-plus/icons-vue")['Loading']>
    'LazyElIconLocation': LazyComponent<typeof import("@element-plus/icons-vue")['Location']>
    'LazyElIconLocationFilled': LazyComponent<typeof import("@element-plus/icons-vue")['LocationFilled']>
    'LazyElIconLocationInformation': LazyComponent<typeof import("@element-plus/icons-vue")['LocationInformation']>
    'LazyElIconLock': LazyComponent<typeof import("@element-plus/icons-vue")['Lock']>
    'LazyElIconLollipop': LazyComponent<typeof import("@element-plus/icons-vue")['Lollipop']>
    'LazyElIconMagicStick': LazyComponent<typeof import("@element-plus/icons-vue")['MagicStick']>
    'LazyElIconMagnet': LazyComponent<typeof import("@element-plus/icons-vue")['Magnet']>
    'LazyElIconMale': LazyComponent<typeof import("@element-plus/icons-vue")['Male']>
    'LazyElIconManagement': LazyComponent<typeof import("@element-plus/icons-vue")['Management']>
    'LazyElIconMapLocation': LazyComponent<typeof import("@element-plus/icons-vue")['MapLocation']>
    'LazyElIconMedal': LazyComponent<typeof import("@element-plus/icons-vue")['Medal']>
    'LazyElIconMemo': LazyComponent<typeof import("@element-plus/icons-vue")['Memo']>
    'LazyElIconMenu': LazyComponent<typeof import("@element-plus/icons-vue")['Menu']>
    'LazyElIconMessage': LazyComponent<typeof import("@element-plus/icons-vue")['Message']>
    'LazyElIconMessageBox': LazyComponent<typeof import("@element-plus/icons-vue")['MessageBox']>
    'LazyElIconMic': LazyComponent<typeof import("@element-plus/icons-vue")['Mic']>
    'LazyElIconMicrophone': LazyComponent<typeof import("@element-plus/icons-vue")['Microphone']>
    'LazyElIconMilkTea': LazyComponent<typeof import("@element-plus/icons-vue")['MilkTea']>
    'LazyElIconMinus': LazyComponent<typeof import("@element-plus/icons-vue")['Minus']>
    'LazyElIconMoney': LazyComponent<typeof import("@element-plus/icons-vue")['Money']>
    'LazyElIconMonitor': LazyComponent<typeof import("@element-plus/icons-vue")['Monitor']>
    'LazyElIconMoon': LazyComponent<typeof import("@element-plus/icons-vue")['Moon']>
    'LazyElIconMoonNight': LazyComponent<typeof import("@element-plus/icons-vue")['MoonNight']>
    'LazyElIconMore': LazyComponent<typeof import("@element-plus/icons-vue")['More']>
    'LazyElIconMoreFilled': LazyComponent<typeof import("@element-plus/icons-vue")['MoreFilled']>
    'LazyElIconMostlyCloudy': LazyComponent<typeof import("@element-plus/icons-vue")['MostlyCloudy']>
    'LazyElIconMouse': LazyComponent<typeof import("@element-plus/icons-vue")['Mouse']>
    'LazyElIconMug': LazyComponent<typeof import("@element-plus/icons-vue")['Mug']>
    'LazyElIconMute': LazyComponent<typeof import("@element-plus/icons-vue")['Mute']>
    'LazyElIconMuteNotification': LazyComponent<typeof import("@element-plus/icons-vue")['MuteNotification']>
    'LazyElIconNoSmoking': LazyComponent<typeof import("@element-plus/icons-vue")['NoSmoking']>
    'LazyElIconNotebook': LazyComponent<typeof import("@element-plus/icons-vue")['Notebook']>
    'LazyElIconNotification': LazyComponent<typeof import("@element-plus/icons-vue")['Notification']>
    'LazyElIconOdometer': LazyComponent<typeof import("@element-plus/icons-vue")['Odometer']>
    'LazyElIconOfficeBuilding': LazyComponent<typeof import("@element-plus/icons-vue")['OfficeBuilding']>
    'LazyElIconOpen': LazyComponent<typeof import("@element-plus/icons-vue")['Open']>
    'LazyElIconOperation': LazyComponent<typeof import("@element-plus/icons-vue")['Operation']>
    'LazyElIconOpportunity': LazyComponent<typeof import("@element-plus/icons-vue")['Opportunity']>
    'LazyElIconOrange': LazyComponent<typeof import("@element-plus/icons-vue")['Orange']>
    'LazyElIconPaperclip': LazyComponent<typeof import("@element-plus/icons-vue")['Paperclip']>
    'LazyElIconPartlyCloudy': LazyComponent<typeof import("@element-plus/icons-vue")['PartlyCloudy']>
    'LazyElIconPear': LazyComponent<typeof import("@element-plus/icons-vue")['Pear']>
    'LazyElIconPhone': LazyComponent<typeof import("@element-plus/icons-vue")['Phone']>
    'LazyElIconPhoneFilled': LazyComponent<typeof import("@element-plus/icons-vue")['PhoneFilled']>
    'LazyElIconPicture': LazyComponent<typeof import("@element-plus/icons-vue")['Picture']>
    'LazyElIconPictureFilled': LazyComponent<typeof import("@element-plus/icons-vue")['PictureFilled']>
    'LazyElIconPictureRounded': LazyComponent<typeof import("@element-plus/icons-vue")['PictureRounded']>
    'LazyElIconPieChart': LazyComponent<typeof import("@element-plus/icons-vue")['PieChart']>
    'LazyElIconPlace': LazyComponent<typeof import("@element-plus/icons-vue")['Place']>
    'LazyElIconPlatform': LazyComponent<typeof import("@element-plus/icons-vue")['Platform']>
    'LazyElIconPlus': LazyComponent<typeof import("@element-plus/icons-vue")['Plus']>
    'LazyElIconPointer': LazyComponent<typeof import("@element-plus/icons-vue")['Pointer']>
    'LazyElIconPosition': LazyComponent<typeof import("@element-plus/icons-vue")['Position']>
    'LazyElIconPostcard': LazyComponent<typeof import("@element-plus/icons-vue")['Postcard']>
    'LazyElIconPouring': LazyComponent<typeof import("@element-plus/icons-vue")['Pouring']>
    'LazyElIconPresent': LazyComponent<typeof import("@element-plus/icons-vue")['Present']>
    'LazyElIconPriceTag': LazyComponent<typeof import("@element-plus/icons-vue")['PriceTag']>
    'LazyElIconPrinter': LazyComponent<typeof import("@element-plus/icons-vue")['Printer']>
    'LazyElIconPromotion': LazyComponent<typeof import("@element-plus/icons-vue")['Promotion']>
    'LazyElIconQuartzWatch': LazyComponent<typeof import("@element-plus/icons-vue")['QuartzWatch']>
    'LazyElIconQuestionFilled': LazyComponent<typeof import("@element-plus/icons-vue")['QuestionFilled']>
    'LazyElIconRank': LazyComponent<typeof import("@element-plus/icons-vue")['Rank']>
    'LazyElIconReading': LazyComponent<typeof import("@element-plus/icons-vue")['Reading']>
    'LazyElIconReadingLamp': LazyComponent<typeof import("@element-plus/icons-vue")['ReadingLamp']>
    'LazyElIconRefresh': LazyComponent<typeof import("@element-plus/icons-vue")['Refresh']>
    'LazyElIconRefreshLeft': LazyComponent<typeof import("@element-plus/icons-vue")['RefreshLeft']>
    'LazyElIconRefreshRight': LazyComponent<typeof import("@element-plus/icons-vue")['RefreshRight']>
    'LazyElIconRefrigerator': LazyComponent<typeof import("@element-plus/icons-vue")['Refrigerator']>
    'LazyElIconRemove': LazyComponent<typeof import("@element-plus/icons-vue")['Remove']>
    'LazyElIconRemoveFilled': LazyComponent<typeof import("@element-plus/icons-vue")['RemoveFilled']>
    'LazyElIconRight': LazyComponent<typeof import("@element-plus/icons-vue")['Right']>
    'LazyElIconScaleToOriginal': LazyComponent<typeof import("@element-plus/icons-vue")['ScaleToOriginal']>
    'LazyElIconSchool': LazyComponent<typeof import("@element-plus/icons-vue")['School']>
    'LazyElIconScissor': LazyComponent<typeof import("@element-plus/icons-vue")['Scissor']>
    'LazyElIconSearch': LazyComponent<typeof import("@element-plus/icons-vue")['Search']>
    'LazyElIconSelect': LazyComponent<typeof import("@element-plus/icons-vue")['Select']>
    'LazyElIconSell': LazyComponent<typeof import("@element-plus/icons-vue")['Sell']>
    'LazyElIconSemiSelect': LazyComponent<typeof import("@element-plus/icons-vue")['SemiSelect']>
    'LazyElIconService': LazyComponent<typeof import("@element-plus/icons-vue")['Service']>
    'LazyElIconSetUp': LazyComponent<typeof import("@element-plus/icons-vue")['SetUp']>
    'LazyElIconSetting': LazyComponent<typeof import("@element-plus/icons-vue")['Setting']>
    'LazyElIconShare': LazyComponent<typeof import("@element-plus/icons-vue")['Share']>
    'LazyElIconShip': LazyComponent<typeof import("@element-plus/icons-vue")['Ship']>
    'LazyElIconShop': LazyComponent<typeof import("@element-plus/icons-vue")['Shop']>
    'LazyElIconShoppingBag': LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingBag']>
    'LazyElIconShoppingCart': LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingCart']>
    'LazyElIconShoppingCartFull': LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingCartFull']>
    'LazyElIconShoppingTrolley': LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingTrolley']>
    'LazyElIconSmoking': LazyComponent<typeof import("@element-plus/icons-vue")['Smoking']>
    'LazyElIconSoccer': LazyComponent<typeof import("@element-plus/icons-vue")['Soccer']>
    'LazyElIconSoldOut': LazyComponent<typeof import("@element-plus/icons-vue")['SoldOut']>
    'LazyElIconSort': LazyComponent<typeof import("@element-plus/icons-vue")['Sort']>
    'LazyElIconSortDown': LazyComponent<typeof import("@element-plus/icons-vue")['SortDown']>
    'LazyElIconSortUp': LazyComponent<typeof import("@element-plus/icons-vue")['SortUp']>
    'LazyElIconStamp': LazyComponent<typeof import("@element-plus/icons-vue")['Stamp']>
    'LazyElIconStar': LazyComponent<typeof import("@element-plus/icons-vue")['Star']>
    'LazyElIconStarFilled': LazyComponent<typeof import("@element-plus/icons-vue")['StarFilled']>
    'LazyElIconStopwatch': LazyComponent<typeof import("@element-plus/icons-vue")['Stopwatch']>
    'LazyElIconSuccessFilled': LazyComponent<typeof import("@element-plus/icons-vue")['SuccessFilled']>
    'LazyElIconSugar': LazyComponent<typeof import("@element-plus/icons-vue")['Sugar']>
    'LazyElIconSuitcase': LazyComponent<typeof import("@element-plus/icons-vue")['Suitcase']>
    'LazyElIconSuitcaseLine': LazyComponent<typeof import("@element-plus/icons-vue")['SuitcaseLine']>
    'LazyElIconSunny': LazyComponent<typeof import("@element-plus/icons-vue")['Sunny']>
    'LazyElIconSunrise': LazyComponent<typeof import("@element-plus/icons-vue")['Sunrise']>
    'LazyElIconSunset': LazyComponent<typeof import("@element-plus/icons-vue")['Sunset']>
    'LazyElIconSwitch': LazyComponent<typeof import("@element-plus/icons-vue")['Switch']>
    'LazyElIconSwitchButton': LazyComponent<typeof import("@element-plus/icons-vue")['SwitchButton']>
    'LazyElIconSwitchFilled': LazyComponent<typeof import("@element-plus/icons-vue")['SwitchFilled']>
    'LazyElIconTakeawayBox': LazyComponent<typeof import("@element-plus/icons-vue")['TakeawayBox']>
    'LazyElIconTicket': LazyComponent<typeof import("@element-plus/icons-vue")['Ticket']>
    'LazyElIconTickets': LazyComponent<typeof import("@element-plus/icons-vue")['Tickets']>
    'LazyElIconTimer': LazyComponent<typeof import("@element-plus/icons-vue")['Timer']>
    'LazyElIconToiletPaper': LazyComponent<typeof import("@element-plus/icons-vue")['ToiletPaper']>
    'LazyElIconTools': LazyComponent<typeof import("@element-plus/icons-vue")['Tools']>
    'LazyElIconTop': LazyComponent<typeof import("@element-plus/icons-vue")['Top']>
    'LazyElIconTopLeft': LazyComponent<typeof import("@element-plus/icons-vue")['TopLeft']>
    'LazyElIconTopRight': LazyComponent<typeof import("@element-plus/icons-vue")['TopRight']>
    'LazyElIconTrendCharts': LazyComponent<typeof import("@element-plus/icons-vue")['TrendCharts']>
    'LazyElIconTrophy': LazyComponent<typeof import("@element-plus/icons-vue")['Trophy']>
    'LazyElIconTrophyBase': LazyComponent<typeof import("@element-plus/icons-vue")['TrophyBase']>
    'LazyElIconTurnOff': LazyComponent<typeof import("@element-plus/icons-vue")['TurnOff']>
    'LazyElIconUmbrella': LazyComponent<typeof import("@element-plus/icons-vue")['Umbrella']>
    'LazyElIconUnlock': LazyComponent<typeof import("@element-plus/icons-vue")['Unlock']>
    'LazyElIconUpload': LazyComponent<typeof import("@element-plus/icons-vue")['Upload']>
    'LazyElIconUploadFilled': LazyComponent<typeof import("@element-plus/icons-vue")['UploadFilled']>
    'LazyElIconUser': LazyComponent<typeof import("@element-plus/icons-vue")['User']>
    'LazyElIconUserFilled': LazyComponent<typeof import("@element-plus/icons-vue")['UserFilled']>
    'LazyElIconVan': LazyComponent<typeof import("@element-plus/icons-vue")['Van']>
    'LazyElIconVideoCamera': LazyComponent<typeof import("@element-plus/icons-vue")['VideoCamera']>
    'LazyElIconVideoCameraFilled': LazyComponent<typeof import("@element-plus/icons-vue")['VideoCameraFilled']>
    'LazyElIconVideoPause': LazyComponent<typeof import("@element-plus/icons-vue")['VideoPause']>
    'LazyElIconVideoPlay': LazyComponent<typeof import("@element-plus/icons-vue")['VideoPlay']>
    'LazyElIconView': LazyComponent<typeof import("@element-plus/icons-vue")['View']>
    'LazyElIconWallet': LazyComponent<typeof import("@element-plus/icons-vue")['Wallet']>
    'LazyElIconWalletFilled': LazyComponent<typeof import("@element-plus/icons-vue")['WalletFilled']>
    'LazyElIconWarnTriangleFilled': LazyComponent<typeof import("@element-plus/icons-vue")['WarnTriangleFilled']>
    'LazyElIconWarning': LazyComponent<typeof import("@element-plus/icons-vue")['Warning']>
    'LazyElIconWarningFilled': LazyComponent<typeof import("@element-plus/icons-vue")['WarningFilled']>
    'LazyElIconWatch': LazyComponent<typeof import("@element-plus/icons-vue")['Watch']>
    'LazyElIconWatermelon': LazyComponent<typeof import("@element-plus/icons-vue")['Watermelon']>
    'LazyElIconWindPower': LazyComponent<typeof import("@element-plus/icons-vue")['WindPower']>
    'LazyElIconZoomIn': LazyComponent<typeof import("@element-plus/icons-vue")['ZoomIn']>
    'LazyElIconZoomOut': LazyComponent<typeof import("@element-plus/icons-vue")['ZoomOut']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const AccountOrder: typeof import("../components/Account/Order.vue")['default']
export const AccountWechat: typeof import("../components/Account/Wechat.vue")['default']
export const CommonAiAssistant: typeof import("../components/Common/AiAssistant.vue")['default']
export const CommonFooter: typeof import("../components/Common/Footer.vue")['default']
export const CommonHeader: typeof import("../components/Common/Header.vue")['default']
export const CommonLink: typeof import("../components/Common/Link.vue")['default']
export const CommonPagination: typeof import("../components/Common/Pagination.vue")['default']
export const CommonPay: typeof import("../components/Common/Pay.vue")['default']
export const CommonPdfViewer: typeof import("../components/Common/PdfViewer.vue")['default']
export const CommonRichTextEditor: typeof import("../components/Common/RichTextEditor.vue")['default']
export const CommonUser: typeof import("../components/Common/User.vue")['default']
export const CourseChapter: typeof import("../components/Course/Chapter.vue")['default']
export const CourseChoose: typeof import("../components/Course/Choose.vue")['default']
export const CourseCollect: typeof import("../components/Course/Collect.vue")['default']
export const CourseCommentList: typeof import("../components/Course/CommentList.vue")['default']
export const CourseAI: typeof import("../components/Course/CourseAI.vue")['default']
export const CourseExam: typeof import("../components/Course/CourseExam.vue")['default']
export const CourseHomework: typeof import("../components/Course/CourseHomework.vue")['default']
export const CourseList: typeof import("../components/Course/List.vue")['default']
export const CourseNoteList: typeof import("../components/Course/NoteList.vue")['default']
export const CourseProgressTracker: typeof import("../components/Course/ProgressTracker.vue")['default']
export const CourseVideoPlayer: typeof import("../components/Course/VideoPlayer.vue")['default']
export const LecturerList: typeof import("../components/Lecturer/List.vue")['default']
export const WorksWorkUpload: typeof import("../components/Works/WorkUpload.vue")['default']
export const WorksWorkWall: typeof import("../components/Works/WorkWall.vue")['default']
export const ZoneCategory: typeof import("../components/Zone/Category.vue")['default']
export const ZoneCourse: typeof import("../components/Zone/Course.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ElAffix: typeof import("element-plus/es/components/affix/index")['ElAffix']
export const ElAlert: typeof import("element-plus/es/components/alert/index")['ElAlert']
export const ElAutocomplete: typeof import("element-plus/es/components/autocomplete/index")['ElAutocomplete']
export const ElAutoResizer: typeof import("element-plus/es/components/table-v2/index")['ElAutoResizer']
export const ElAvatar: typeof import("element-plus/es/components/avatar/index")['ElAvatar']
export const ElBacktop: typeof import("element-plus/es/components/backtop/index")['ElBacktop']
export const ElBadge: typeof import("element-plus/es/components/badge/index")['ElBadge']
export const ElBreadcrumb: typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumb']
export const ElBreadcrumbItem: typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumbItem']
export const ElButton: typeof import("element-plus/es/components/button/index")['ElButton']
export const ElButtonGroup: typeof import("element-plus/es/components/button/index")['ElButtonGroup']
export const ElCalendar: typeof import("element-plus/es/components/calendar/index")['ElCalendar']
export const ElCard: typeof import("element-plus/es/components/card/index")['ElCard']
export const ElCarousel: typeof import("element-plus/es/components/carousel/index")['ElCarousel']
export const ElCarouselItem: typeof import("element-plus/es/components/carousel/index")['ElCarouselItem']
export const ElCascader: typeof import("element-plus/es/components/cascader/index")['ElCascader']
export const ElCascaderPanel: typeof import("element-plus/es/components/cascader-panel/index")['ElCascaderPanel']
export const ElCheckTag: typeof import("element-plus/es/components/check-tag/index")['ElCheckTag']
export const ElCheckbox: typeof import("element-plus/es/components/checkbox/index")['ElCheckbox']
export const ElCheckboxButton: typeof import("element-plus/es/components/checkbox/index")['ElCheckboxButton']
export const ElCheckboxGroup: typeof import("element-plus/es/components/checkbox/index")['ElCheckboxGroup']
export const ElCol: typeof import("element-plus/es/components/col/index")['ElCol']
export const ElCollapse: typeof import("element-plus/es/components/collapse/index")['ElCollapse']
export const ElCollapseItem: typeof import("element-plus/es/components/collapse/index")['ElCollapseItem']
export const ElCollapseTransition: typeof import("element-plus/es/components/collapse-transition/index")['ElCollapseTransition']
export const ElColorPicker: typeof import("element-plus/es/components/color-picker/index")['ElColorPicker']
export const ElConfigProvider: typeof import("element-plus/es/components/config-provider/index")['ElConfigProvider']
export const ElContainer: typeof import("element-plus/es/components/container/index")['ElContainer']
export const ElAside: typeof import("element-plus/es/components/container/index")['ElAside']
export const ElFooter: typeof import("element-plus/es/components/container/index")['ElFooter']
export const ElHeader: typeof import("element-plus/es/components/container/index")['ElHeader']
export const ElMain: typeof import("element-plus/es/components/container/index")['ElMain']
export const ElDatePicker: typeof import("element-plus/es/components/date-picker/index")['ElDatePicker']
export const ElDescriptions: typeof import("element-plus/es/components/descriptions/index")['ElDescriptions']
export const ElDescriptionsItem: typeof import("element-plus/es/components/descriptions/index")['ElDescriptionsItem']
export const ElDialog: typeof import("element-plus/es/components/dialog/index")['ElDialog']
export const ElDivider: typeof import("element-plus/es/components/divider/index")['ElDivider']
export const ElDrawer: typeof import("element-plus/es/components/drawer/index")['ElDrawer']
export const ElDropdown: typeof import("element-plus/es/components/dropdown/index")['ElDropdown']
export const ElDropdownItem: typeof import("element-plus/es/components/dropdown/index")['ElDropdownItem']
export const ElDropdownMenu: typeof import("element-plus/es/components/dropdown/index")['ElDropdownMenu']
export const ElEmpty: typeof import("element-plus/es/components/empty/index")['ElEmpty']
export const ElForm: typeof import("element-plus/es/components/form/index")['ElForm']
export const ElFormItem: typeof import("element-plus/es/components/form/index")['ElFormItem']
export const ElIcon: typeof import("element-plus/es/components/icon/index")['ElIcon']
export const ElImage: typeof import("element-plus/es/components/image/index")['ElImage']
export const ElImageViewer: typeof import("element-plus/es/components/image-viewer/index")['ElImageViewer']
export const ElInput: typeof import("element-plus/es/components/input/index")['ElInput']
export const ElInputNumber: typeof import("element-plus/es/components/input-number/index")['ElInputNumber']
export const ElInputTag: typeof import("element-plus/es/components/input-tag/index")['ElInputTag']
export const ElLink: typeof import("element-plus/es/components/link/index")['ElLink']
export const ElMenu: typeof import("element-plus/es/components/menu/index")['ElMenu']
export const ElMenuItem: typeof import("element-plus/es/components/menu/index")['ElMenuItem']
export const ElMenuItemGroup: typeof import("element-plus/es/components/menu/index")['ElMenuItemGroup']
export const ElSubMenu: typeof import("element-plus/es/components/menu/index")['ElSubMenu']
export const ElPageHeader: typeof import("element-plus/es/components/page-header/index")['ElPageHeader']
export const ElPagination: typeof import("element-plus/es/components/pagination/index")['ElPagination']
export const ElPopconfirm: typeof import("element-plus/es/components/popconfirm/index")['ElPopconfirm']
export const ElPopover: typeof import("element-plus/es/components/popover/index")['ElPopover']
export const ElPopper: typeof import("element-plus/es/components/popper/index")['ElPopper']
export const ElProgress: typeof import("element-plus/es/components/progress/index")['ElProgress']
export const ElRadio: typeof import("element-plus/es/components/radio/index")['ElRadio']
export const ElRadioButton: typeof import("element-plus/es/components/radio/index")['ElRadioButton']
export const ElRadioGroup: typeof import("element-plus/es/components/radio/index")['ElRadioGroup']
export const ElRate: typeof import("element-plus/es/components/rate/index")['ElRate']
export const ElResult: typeof import("element-plus/es/components/result/index")['ElResult']
export const ElRow: typeof import("element-plus/es/components/row/index")['ElRow']
export const ElScrollbar: typeof import("element-plus/es/components/scrollbar/index")['ElScrollbar']
export const ElSelect: typeof import("element-plus/es/components/select/index")['ElSelect']
export const ElOption: typeof import("element-plus/es/components/select/index")['ElOption']
export const ElOptionGroup: typeof import("element-plus/es/components/select/index")['ElOptionGroup']
export const ElSelectV2: typeof import("element-plus/es/components/select-v2/index")['ElSelectV2']
export const ElSkeleton: typeof import("element-plus/es/components/skeleton/index")['ElSkeleton']
export const ElSkeletonItem: typeof import("element-plus/es/components/skeleton/index")['ElSkeletonItem']
export const ElSlider: typeof import("element-plus/es/components/slider/index")['ElSlider']
export const ElSpace: typeof import("element-plus/es/components/space/index")['ElSpace']
export const ElStatistic: typeof import("element-plus/es/components/statistic/index")['ElStatistic']
export const ElCountdown: typeof import("element-plus/es/components/countdown/index")['ElCountdown']
export const ElSteps: typeof import("element-plus/es/components/steps/index")['ElSteps']
export const ElStep: typeof import("element-plus/es/components/steps/index")['ElStep']
export const ElSwitch: typeof import("element-plus/es/components/switch/index")['ElSwitch']
export const ElTable: typeof import("element-plus/es/components/table/index")['ElTable']
export const ElTableColumn: typeof import("element-plus/es/components/table/index")['ElTableColumn']
export const ElTableV2: typeof import("element-plus/es/components/table-v2/index")['ElTableV2']
export const ElTabs: typeof import("element-plus/es/components/tabs/index")['ElTabs']
export const ElTabPane: typeof import("element-plus/es/components/tabs/index")['ElTabPane']
export const ElTag: typeof import("element-plus/es/components/tag/index")['ElTag']
export const ElText: typeof import("element-plus/es/components/text/index")['ElText']
export const ElTimePicker: typeof import("element-plus/es/components/time-picker/index")['ElTimePicker']
export const ElTimeSelect: typeof import("element-plus/es/components/time-select/index")['ElTimeSelect']
export const ElTimeline: typeof import("element-plus/es/components/timeline/index")['ElTimeline']
export const ElTimelineItem: typeof import("element-plus/es/components/timeline/index")['ElTimelineItem']
export const ElTooltip: typeof import("element-plus/es/components/tooltip/index")['ElTooltip']
export const ElTooltipV2: typeof import("element-plus/es/components/tooltip-v2/index")['ElTooltipV2']
export const ElTransfer: typeof import("element-plus/es/components/transfer/index")['ElTransfer']
export const ElTree: typeof import("element-plus/es/components/tree/index")['ElTree']
export const ElTreeSelect: typeof import("element-plus/es/components/tree-select/index")['ElTreeSelect']
export const ElTreeV2: typeof import("element-plus/es/components/tree-v2/index")['ElTreeV2']
export const ElUpload: typeof import("element-plus/es/components/upload/index")['ElUpload']
export const ElWatermark: typeof import("element-plus/es/components/watermark/index")['ElWatermark']
export const ElTour: typeof import("element-plus/es/components/tour/index")['ElTour']
export const ElTourStep: typeof import("element-plus/es/components/tour/index")['ElTourStep']
export const ElAnchor: typeof import("element-plus/es/components/anchor/index")['ElAnchor']
export const ElAnchorLink: typeof import("element-plus/es/components/anchor/index")['ElAnchorLink']
export const ElSegmented: typeof import("element-plus/es/components/segmented/index")['ElSegmented']
export const ElMention: typeof import("element-plus/es/components/mention/index")['ElMention']
export const ElIconAddLocation: typeof import("@element-plus/icons-vue")['AddLocation']
export const ElIconAim: typeof import("@element-plus/icons-vue")['Aim']
export const ElIconAlarmClock: typeof import("@element-plus/icons-vue")['AlarmClock']
export const ElIconApple: typeof import("@element-plus/icons-vue")['Apple']
export const ElIconArrowDown: typeof import("@element-plus/icons-vue")['ArrowDown']
export const ElIconArrowDownBold: typeof import("@element-plus/icons-vue")['ArrowDownBold']
export const ElIconArrowLeft: typeof import("@element-plus/icons-vue")['ArrowLeft']
export const ElIconArrowLeftBold: typeof import("@element-plus/icons-vue")['ArrowLeftBold']
export const ElIconArrowRight: typeof import("@element-plus/icons-vue")['ArrowRight']
export const ElIconArrowRightBold: typeof import("@element-plus/icons-vue")['ArrowRightBold']
export const ElIconArrowUp: typeof import("@element-plus/icons-vue")['ArrowUp']
export const ElIconArrowUpBold: typeof import("@element-plus/icons-vue")['ArrowUpBold']
export const ElIconAvatar: typeof import("@element-plus/icons-vue")['Avatar']
export const ElIconBack: typeof import("@element-plus/icons-vue")['Back']
export const ElIconBaseball: typeof import("@element-plus/icons-vue")['Baseball']
export const ElIconBasketball: typeof import("@element-plus/icons-vue")['Basketball']
export const ElIconBell: typeof import("@element-plus/icons-vue")['Bell']
export const ElIconBellFilled: typeof import("@element-plus/icons-vue")['BellFilled']
export const ElIconBicycle: typeof import("@element-plus/icons-vue")['Bicycle']
export const ElIconBottom: typeof import("@element-plus/icons-vue")['Bottom']
export const ElIconBottomLeft: typeof import("@element-plus/icons-vue")['BottomLeft']
export const ElIconBottomRight: typeof import("@element-plus/icons-vue")['BottomRight']
export const ElIconBowl: typeof import("@element-plus/icons-vue")['Bowl']
export const ElIconBox: typeof import("@element-plus/icons-vue")['Box']
export const ElIconBriefcase: typeof import("@element-plus/icons-vue")['Briefcase']
export const ElIconBrush: typeof import("@element-plus/icons-vue")['Brush']
export const ElIconBrushFilled: typeof import("@element-plus/icons-vue")['BrushFilled']
export const ElIconBurger: typeof import("@element-plus/icons-vue")['Burger']
export const ElIconCalendar: typeof import("@element-plus/icons-vue")['Calendar']
export const ElIconCamera: typeof import("@element-plus/icons-vue")['Camera']
export const ElIconCameraFilled: typeof import("@element-plus/icons-vue")['CameraFilled']
export const ElIconCaretBottom: typeof import("@element-plus/icons-vue")['CaretBottom']
export const ElIconCaretLeft: typeof import("@element-plus/icons-vue")['CaretLeft']
export const ElIconCaretRight: typeof import("@element-plus/icons-vue")['CaretRight']
export const ElIconCaretTop: typeof import("@element-plus/icons-vue")['CaretTop']
export const ElIconCellphone: typeof import("@element-plus/icons-vue")['Cellphone']
export const ElIconChatDotRound: typeof import("@element-plus/icons-vue")['ChatDotRound']
export const ElIconChatDotSquare: typeof import("@element-plus/icons-vue")['ChatDotSquare']
export const ElIconChatLineRound: typeof import("@element-plus/icons-vue")['ChatLineRound']
export const ElIconChatLineSquare: typeof import("@element-plus/icons-vue")['ChatLineSquare']
export const ElIconChatRound: typeof import("@element-plus/icons-vue")['ChatRound']
export const ElIconChatSquare: typeof import("@element-plus/icons-vue")['ChatSquare']
export const ElIconCheck: typeof import("@element-plus/icons-vue")['Check']
export const ElIconChecked: typeof import("@element-plus/icons-vue")['Checked']
export const ElIconCherry: typeof import("@element-plus/icons-vue")['Cherry']
export const ElIconChicken: typeof import("@element-plus/icons-vue")['Chicken']
export const ElIconChromeFilled: typeof import("@element-plus/icons-vue")['ChromeFilled']
export const ElIconCircleCheck: typeof import("@element-plus/icons-vue")['CircleCheck']
export const ElIconCircleCheckFilled: typeof import("@element-plus/icons-vue")['CircleCheckFilled']
export const ElIconCircleClose: typeof import("@element-plus/icons-vue")['CircleClose']
export const ElIconCircleCloseFilled: typeof import("@element-plus/icons-vue")['CircleCloseFilled']
export const ElIconCirclePlus: typeof import("@element-plus/icons-vue")['CirclePlus']
export const ElIconCirclePlusFilled: typeof import("@element-plus/icons-vue")['CirclePlusFilled']
export const ElIconClock: typeof import("@element-plus/icons-vue")['Clock']
export const ElIconClose: typeof import("@element-plus/icons-vue")['Close']
export const ElIconCloseBold: typeof import("@element-plus/icons-vue")['CloseBold']
export const ElIconCloudy: typeof import("@element-plus/icons-vue")['Cloudy']
export const ElIconCoffee: typeof import("@element-plus/icons-vue")['Coffee']
export const ElIconCoffeeCup: typeof import("@element-plus/icons-vue")['CoffeeCup']
export const ElIconCoin: typeof import("@element-plus/icons-vue")['Coin']
export const ElIconColdDrink: typeof import("@element-plus/icons-vue")['ColdDrink']
export const ElIconCollection: typeof import("@element-plus/icons-vue")['Collection']
export const ElIconCollectionTag: typeof import("@element-plus/icons-vue")['CollectionTag']
export const ElIconComment: typeof import("@element-plus/icons-vue")['Comment']
export const ElIconCompass: typeof import("@element-plus/icons-vue")['Compass']
export const ElIconConnection: typeof import("@element-plus/icons-vue")['Connection']
export const ElIconCoordinate: typeof import("@element-plus/icons-vue")['Coordinate']
export const ElIconCopyDocument: typeof import("@element-plus/icons-vue")['CopyDocument']
export const ElIconCpu: typeof import("@element-plus/icons-vue")['Cpu']
export const ElIconCreditCard: typeof import("@element-plus/icons-vue")['CreditCard']
export const ElIconCrop: typeof import("@element-plus/icons-vue")['Crop']
export const ElIconDArrowLeft: typeof import("@element-plus/icons-vue")['DArrowLeft']
export const ElIconDArrowRight: typeof import("@element-plus/icons-vue")['DArrowRight']
export const ElIconDCaret: typeof import("@element-plus/icons-vue")['DCaret']
export const ElIconDataAnalysis: typeof import("@element-plus/icons-vue")['DataAnalysis']
export const ElIconDataBoard: typeof import("@element-plus/icons-vue")['DataBoard']
export const ElIconDataLine: typeof import("@element-plus/icons-vue")['DataLine']
export const ElIconDelete: typeof import("@element-plus/icons-vue")['Delete']
export const ElIconDeleteFilled: typeof import("@element-plus/icons-vue")['DeleteFilled']
export const ElIconDeleteLocation: typeof import("@element-plus/icons-vue")['DeleteLocation']
export const ElIconDessert: typeof import("@element-plus/icons-vue")['Dessert']
export const ElIconDiscount: typeof import("@element-plus/icons-vue")['Discount']
export const ElIconDish: typeof import("@element-plus/icons-vue")['Dish']
export const ElIconDishDot: typeof import("@element-plus/icons-vue")['DishDot']
export const ElIconDocument: typeof import("@element-plus/icons-vue")['Document']
export const ElIconDocumentAdd: typeof import("@element-plus/icons-vue")['DocumentAdd']
export const ElIconDocumentChecked: typeof import("@element-plus/icons-vue")['DocumentChecked']
export const ElIconDocumentCopy: typeof import("@element-plus/icons-vue")['DocumentCopy']
export const ElIconDocumentDelete: typeof import("@element-plus/icons-vue")['DocumentDelete']
export const ElIconDocumentRemove: typeof import("@element-plus/icons-vue")['DocumentRemove']
export const ElIconDownload: typeof import("@element-plus/icons-vue")['Download']
export const ElIconDrizzling: typeof import("@element-plus/icons-vue")['Drizzling']
export const ElIconEdit: typeof import("@element-plus/icons-vue")['Edit']
export const ElIconEditPen: typeof import("@element-plus/icons-vue")['EditPen']
export const ElIconEleme: typeof import("@element-plus/icons-vue")['Eleme']
export const ElIconElemeFilled: typeof import("@element-plus/icons-vue")['ElemeFilled']
export const ElIconElementPlus: typeof import("@element-plus/icons-vue")['ElementPlus']
export const ElIconExpand: typeof import("@element-plus/icons-vue")['Expand']
export const ElIconFailed: typeof import("@element-plus/icons-vue")['Failed']
export const ElIconFemale: typeof import("@element-plus/icons-vue")['Female']
export const ElIconFiles: typeof import("@element-plus/icons-vue")['Files']
export const ElIconFilm: typeof import("@element-plus/icons-vue")['Film']
export const ElIconFilter: typeof import("@element-plus/icons-vue")['Filter']
export const ElIconFinished: typeof import("@element-plus/icons-vue")['Finished']
export const ElIconFirstAidKit: typeof import("@element-plus/icons-vue")['FirstAidKit']
export const ElIconFlag: typeof import("@element-plus/icons-vue")['Flag']
export const ElIconFold: typeof import("@element-plus/icons-vue")['Fold']
export const ElIconFolder: typeof import("@element-plus/icons-vue")['Folder']
export const ElIconFolderAdd: typeof import("@element-plus/icons-vue")['FolderAdd']
export const ElIconFolderChecked: typeof import("@element-plus/icons-vue")['FolderChecked']
export const ElIconFolderDelete: typeof import("@element-plus/icons-vue")['FolderDelete']
export const ElIconFolderOpened: typeof import("@element-plus/icons-vue")['FolderOpened']
export const ElIconFolderRemove: typeof import("@element-plus/icons-vue")['FolderRemove']
export const ElIconFood: typeof import("@element-plus/icons-vue")['Food']
export const ElIconFootball: typeof import("@element-plus/icons-vue")['Football']
export const ElIconForkSpoon: typeof import("@element-plus/icons-vue")['ForkSpoon']
export const ElIconFries: typeof import("@element-plus/icons-vue")['Fries']
export const ElIconFullScreen: typeof import("@element-plus/icons-vue")['FullScreen']
export const ElIconGoblet: typeof import("@element-plus/icons-vue")['Goblet']
export const ElIconGobletFull: typeof import("@element-plus/icons-vue")['GobletFull']
export const ElIconGobletSquare: typeof import("@element-plus/icons-vue")['GobletSquare']
export const ElIconGobletSquareFull: typeof import("@element-plus/icons-vue")['GobletSquareFull']
export const ElIconGoldMedal: typeof import("@element-plus/icons-vue")['GoldMedal']
export const ElIconGoods: typeof import("@element-plus/icons-vue")['Goods']
export const ElIconGoodsFilled: typeof import("@element-plus/icons-vue")['GoodsFilled']
export const ElIconGrape: typeof import("@element-plus/icons-vue")['Grape']
export const ElIconGrid: typeof import("@element-plus/icons-vue")['Grid']
export const ElIconGuide: typeof import("@element-plus/icons-vue")['Guide']
export const ElIconHandbag: typeof import("@element-plus/icons-vue")['Handbag']
export const ElIconHeadset: typeof import("@element-plus/icons-vue")['Headset']
export const ElIconHelp: typeof import("@element-plus/icons-vue")['Help']
export const ElIconHelpFilled: typeof import("@element-plus/icons-vue")['HelpFilled']
export const ElIconHide: typeof import("@element-plus/icons-vue")['Hide']
export const ElIconHistogram: typeof import("@element-plus/icons-vue")['Histogram']
export const ElIconHomeFilled: typeof import("@element-plus/icons-vue")['HomeFilled']
export const ElIconHotWater: typeof import("@element-plus/icons-vue")['HotWater']
export const ElIconHouse: typeof import("@element-plus/icons-vue")['House']
export const ElIconIceCream: typeof import("@element-plus/icons-vue")['IceCream']
export const ElIconIceCreamRound: typeof import("@element-plus/icons-vue")['IceCreamRound']
export const ElIconIceCreamSquare: typeof import("@element-plus/icons-vue")['IceCreamSquare']
export const ElIconIceDrink: typeof import("@element-plus/icons-vue")['IceDrink']
export const ElIconIceTea: typeof import("@element-plus/icons-vue")['IceTea']
export const ElIconInfoFilled: typeof import("@element-plus/icons-vue")['InfoFilled']
export const ElIconIphone: typeof import("@element-plus/icons-vue")['Iphone']
export const ElIconKey: typeof import("@element-plus/icons-vue")['Key']
export const ElIconKnifeFork: typeof import("@element-plus/icons-vue")['KnifeFork']
export const ElIconLightning: typeof import("@element-plus/icons-vue")['Lightning']
export const ElIconLink: typeof import("@element-plus/icons-vue")['Link']
export const ElIconList: typeof import("@element-plus/icons-vue")['List']
export const ElIconLoading: typeof import("@element-plus/icons-vue")['Loading']
export const ElIconLocation: typeof import("@element-plus/icons-vue")['Location']
export const ElIconLocationFilled: typeof import("@element-plus/icons-vue")['LocationFilled']
export const ElIconLocationInformation: typeof import("@element-plus/icons-vue")['LocationInformation']
export const ElIconLock: typeof import("@element-plus/icons-vue")['Lock']
export const ElIconLollipop: typeof import("@element-plus/icons-vue")['Lollipop']
export const ElIconMagicStick: typeof import("@element-plus/icons-vue")['MagicStick']
export const ElIconMagnet: typeof import("@element-plus/icons-vue")['Magnet']
export const ElIconMale: typeof import("@element-plus/icons-vue")['Male']
export const ElIconManagement: typeof import("@element-plus/icons-vue")['Management']
export const ElIconMapLocation: typeof import("@element-plus/icons-vue")['MapLocation']
export const ElIconMedal: typeof import("@element-plus/icons-vue")['Medal']
export const ElIconMemo: typeof import("@element-plus/icons-vue")['Memo']
export const ElIconMenu: typeof import("@element-plus/icons-vue")['Menu']
export const ElIconMessage: typeof import("@element-plus/icons-vue")['Message']
export const ElIconMessageBox: typeof import("@element-plus/icons-vue")['MessageBox']
export const ElIconMic: typeof import("@element-plus/icons-vue")['Mic']
export const ElIconMicrophone: typeof import("@element-plus/icons-vue")['Microphone']
export const ElIconMilkTea: typeof import("@element-plus/icons-vue")['MilkTea']
export const ElIconMinus: typeof import("@element-plus/icons-vue")['Minus']
export const ElIconMoney: typeof import("@element-plus/icons-vue")['Money']
export const ElIconMonitor: typeof import("@element-plus/icons-vue")['Monitor']
export const ElIconMoon: typeof import("@element-plus/icons-vue")['Moon']
export const ElIconMoonNight: typeof import("@element-plus/icons-vue")['MoonNight']
export const ElIconMore: typeof import("@element-plus/icons-vue")['More']
export const ElIconMoreFilled: typeof import("@element-plus/icons-vue")['MoreFilled']
export const ElIconMostlyCloudy: typeof import("@element-plus/icons-vue")['MostlyCloudy']
export const ElIconMouse: typeof import("@element-plus/icons-vue")['Mouse']
export const ElIconMug: typeof import("@element-plus/icons-vue")['Mug']
export const ElIconMute: typeof import("@element-plus/icons-vue")['Mute']
export const ElIconMuteNotification: typeof import("@element-plus/icons-vue")['MuteNotification']
export const ElIconNoSmoking: typeof import("@element-plus/icons-vue")['NoSmoking']
export const ElIconNotebook: typeof import("@element-plus/icons-vue")['Notebook']
export const ElIconNotification: typeof import("@element-plus/icons-vue")['Notification']
export const ElIconOdometer: typeof import("@element-plus/icons-vue")['Odometer']
export const ElIconOfficeBuilding: typeof import("@element-plus/icons-vue")['OfficeBuilding']
export const ElIconOpen: typeof import("@element-plus/icons-vue")['Open']
export const ElIconOperation: typeof import("@element-plus/icons-vue")['Operation']
export const ElIconOpportunity: typeof import("@element-plus/icons-vue")['Opportunity']
export const ElIconOrange: typeof import("@element-plus/icons-vue")['Orange']
export const ElIconPaperclip: typeof import("@element-plus/icons-vue")['Paperclip']
export const ElIconPartlyCloudy: typeof import("@element-plus/icons-vue")['PartlyCloudy']
export const ElIconPear: typeof import("@element-plus/icons-vue")['Pear']
export const ElIconPhone: typeof import("@element-plus/icons-vue")['Phone']
export const ElIconPhoneFilled: typeof import("@element-plus/icons-vue")['PhoneFilled']
export const ElIconPicture: typeof import("@element-plus/icons-vue")['Picture']
export const ElIconPictureFilled: typeof import("@element-plus/icons-vue")['PictureFilled']
export const ElIconPictureRounded: typeof import("@element-plus/icons-vue")['PictureRounded']
export const ElIconPieChart: typeof import("@element-plus/icons-vue")['PieChart']
export const ElIconPlace: typeof import("@element-plus/icons-vue")['Place']
export const ElIconPlatform: typeof import("@element-plus/icons-vue")['Platform']
export const ElIconPlus: typeof import("@element-plus/icons-vue")['Plus']
export const ElIconPointer: typeof import("@element-plus/icons-vue")['Pointer']
export const ElIconPosition: typeof import("@element-plus/icons-vue")['Position']
export const ElIconPostcard: typeof import("@element-plus/icons-vue")['Postcard']
export const ElIconPouring: typeof import("@element-plus/icons-vue")['Pouring']
export const ElIconPresent: typeof import("@element-plus/icons-vue")['Present']
export const ElIconPriceTag: typeof import("@element-plus/icons-vue")['PriceTag']
export const ElIconPrinter: typeof import("@element-plus/icons-vue")['Printer']
export const ElIconPromotion: typeof import("@element-plus/icons-vue")['Promotion']
export const ElIconQuartzWatch: typeof import("@element-plus/icons-vue")['QuartzWatch']
export const ElIconQuestionFilled: typeof import("@element-plus/icons-vue")['QuestionFilled']
export const ElIconRank: typeof import("@element-plus/icons-vue")['Rank']
export const ElIconReading: typeof import("@element-plus/icons-vue")['Reading']
export const ElIconReadingLamp: typeof import("@element-plus/icons-vue")['ReadingLamp']
export const ElIconRefresh: typeof import("@element-plus/icons-vue")['Refresh']
export const ElIconRefreshLeft: typeof import("@element-plus/icons-vue")['RefreshLeft']
export const ElIconRefreshRight: typeof import("@element-plus/icons-vue")['RefreshRight']
export const ElIconRefrigerator: typeof import("@element-plus/icons-vue")['Refrigerator']
export const ElIconRemove: typeof import("@element-plus/icons-vue")['Remove']
export const ElIconRemoveFilled: typeof import("@element-plus/icons-vue")['RemoveFilled']
export const ElIconRight: typeof import("@element-plus/icons-vue")['Right']
export const ElIconScaleToOriginal: typeof import("@element-plus/icons-vue")['ScaleToOriginal']
export const ElIconSchool: typeof import("@element-plus/icons-vue")['School']
export const ElIconScissor: typeof import("@element-plus/icons-vue")['Scissor']
export const ElIconSearch: typeof import("@element-plus/icons-vue")['Search']
export const ElIconSelect: typeof import("@element-plus/icons-vue")['Select']
export const ElIconSell: typeof import("@element-plus/icons-vue")['Sell']
export const ElIconSemiSelect: typeof import("@element-plus/icons-vue")['SemiSelect']
export const ElIconService: typeof import("@element-plus/icons-vue")['Service']
export const ElIconSetUp: typeof import("@element-plus/icons-vue")['SetUp']
export const ElIconSetting: typeof import("@element-plus/icons-vue")['Setting']
export const ElIconShare: typeof import("@element-plus/icons-vue")['Share']
export const ElIconShip: typeof import("@element-plus/icons-vue")['Ship']
export const ElIconShop: typeof import("@element-plus/icons-vue")['Shop']
export const ElIconShoppingBag: typeof import("@element-plus/icons-vue")['ShoppingBag']
export const ElIconShoppingCart: typeof import("@element-plus/icons-vue")['ShoppingCart']
export const ElIconShoppingCartFull: typeof import("@element-plus/icons-vue")['ShoppingCartFull']
export const ElIconShoppingTrolley: typeof import("@element-plus/icons-vue")['ShoppingTrolley']
export const ElIconSmoking: typeof import("@element-plus/icons-vue")['Smoking']
export const ElIconSoccer: typeof import("@element-plus/icons-vue")['Soccer']
export const ElIconSoldOut: typeof import("@element-plus/icons-vue")['SoldOut']
export const ElIconSort: typeof import("@element-plus/icons-vue")['Sort']
export const ElIconSortDown: typeof import("@element-plus/icons-vue")['SortDown']
export const ElIconSortUp: typeof import("@element-plus/icons-vue")['SortUp']
export const ElIconStamp: typeof import("@element-plus/icons-vue")['Stamp']
export const ElIconStar: typeof import("@element-plus/icons-vue")['Star']
export const ElIconStarFilled: typeof import("@element-plus/icons-vue")['StarFilled']
export const ElIconStopwatch: typeof import("@element-plus/icons-vue")['Stopwatch']
export const ElIconSuccessFilled: typeof import("@element-plus/icons-vue")['SuccessFilled']
export const ElIconSugar: typeof import("@element-plus/icons-vue")['Sugar']
export const ElIconSuitcase: typeof import("@element-plus/icons-vue")['Suitcase']
export const ElIconSuitcaseLine: typeof import("@element-plus/icons-vue")['SuitcaseLine']
export const ElIconSunny: typeof import("@element-plus/icons-vue")['Sunny']
export const ElIconSunrise: typeof import("@element-plus/icons-vue")['Sunrise']
export const ElIconSunset: typeof import("@element-plus/icons-vue")['Sunset']
export const ElIconSwitch: typeof import("@element-plus/icons-vue")['Switch']
export const ElIconSwitchButton: typeof import("@element-plus/icons-vue")['SwitchButton']
export const ElIconSwitchFilled: typeof import("@element-plus/icons-vue")['SwitchFilled']
export const ElIconTakeawayBox: typeof import("@element-plus/icons-vue")['TakeawayBox']
export const ElIconTicket: typeof import("@element-plus/icons-vue")['Ticket']
export const ElIconTickets: typeof import("@element-plus/icons-vue")['Tickets']
export const ElIconTimer: typeof import("@element-plus/icons-vue")['Timer']
export const ElIconToiletPaper: typeof import("@element-plus/icons-vue")['ToiletPaper']
export const ElIconTools: typeof import("@element-plus/icons-vue")['Tools']
export const ElIconTop: typeof import("@element-plus/icons-vue")['Top']
export const ElIconTopLeft: typeof import("@element-plus/icons-vue")['TopLeft']
export const ElIconTopRight: typeof import("@element-plus/icons-vue")['TopRight']
export const ElIconTrendCharts: typeof import("@element-plus/icons-vue")['TrendCharts']
export const ElIconTrophy: typeof import("@element-plus/icons-vue")['Trophy']
export const ElIconTrophyBase: typeof import("@element-plus/icons-vue")['TrophyBase']
export const ElIconTurnOff: typeof import("@element-plus/icons-vue")['TurnOff']
export const ElIconUmbrella: typeof import("@element-plus/icons-vue")['Umbrella']
export const ElIconUnlock: typeof import("@element-plus/icons-vue")['Unlock']
export const ElIconUpload: typeof import("@element-plus/icons-vue")['Upload']
export const ElIconUploadFilled: typeof import("@element-plus/icons-vue")['UploadFilled']
export const ElIconUser: typeof import("@element-plus/icons-vue")['User']
export const ElIconUserFilled: typeof import("@element-plus/icons-vue")['UserFilled']
export const ElIconVan: typeof import("@element-plus/icons-vue")['Van']
export const ElIconVideoCamera: typeof import("@element-plus/icons-vue")['VideoCamera']
export const ElIconVideoCameraFilled: typeof import("@element-plus/icons-vue")['VideoCameraFilled']
export const ElIconVideoPause: typeof import("@element-plus/icons-vue")['VideoPause']
export const ElIconVideoPlay: typeof import("@element-plus/icons-vue")['VideoPlay']
export const ElIconView: typeof import("@element-plus/icons-vue")['View']
export const ElIconWallet: typeof import("@element-plus/icons-vue")['Wallet']
export const ElIconWalletFilled: typeof import("@element-plus/icons-vue")['WalletFilled']
export const ElIconWarnTriangleFilled: typeof import("@element-plus/icons-vue")['WarnTriangleFilled']
export const ElIconWarning: typeof import("@element-plus/icons-vue")['Warning']
export const ElIconWarningFilled: typeof import("@element-plus/icons-vue")['WarningFilled']
export const ElIconWatch: typeof import("@element-plus/icons-vue")['Watch']
export const ElIconWatermelon: typeof import("@element-plus/icons-vue")['Watermelon']
export const ElIconWindPower: typeof import("@element-plus/icons-vue")['WindPower']
export const ElIconZoomIn: typeof import("@element-plus/icons-vue")['ZoomIn']
export const ElIconZoomOut: typeof import("@element-plus/icons-vue")['ZoomOut']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyAccountOrder: LazyComponent<typeof import("../components/Account/Order.vue")['default']>
export const LazyAccountWechat: LazyComponent<typeof import("../components/Account/Wechat.vue")['default']>
export const LazyCommonAiAssistant: LazyComponent<typeof import("../components/Common/AiAssistant.vue")['default']>
export const LazyCommonFooter: LazyComponent<typeof import("../components/Common/Footer.vue")['default']>
export const LazyCommonHeader: LazyComponent<typeof import("../components/Common/Header.vue")['default']>
export const LazyCommonLink: LazyComponent<typeof import("../components/Common/Link.vue")['default']>
export const LazyCommonPagination: LazyComponent<typeof import("../components/Common/Pagination.vue")['default']>
export const LazyCommonPay: LazyComponent<typeof import("../components/Common/Pay.vue")['default']>
export const LazyCommonPdfViewer: LazyComponent<typeof import("../components/Common/PdfViewer.vue")['default']>
export const LazyCommonRichTextEditor: LazyComponent<typeof import("../components/Common/RichTextEditor.vue")['default']>
export const LazyCommonUser: LazyComponent<typeof import("../components/Common/User.vue")['default']>
export const LazyCourseChapter: LazyComponent<typeof import("../components/Course/Chapter.vue")['default']>
export const LazyCourseChoose: LazyComponent<typeof import("../components/Course/Choose.vue")['default']>
export const LazyCourseCollect: LazyComponent<typeof import("../components/Course/Collect.vue")['default']>
export const LazyCourseCommentList: LazyComponent<typeof import("../components/Course/CommentList.vue")['default']>
export const LazyCourseAI: LazyComponent<typeof import("../components/Course/CourseAI.vue")['default']>
export const LazyCourseExam: LazyComponent<typeof import("../components/Course/CourseExam.vue")['default']>
export const LazyCourseHomework: LazyComponent<typeof import("../components/Course/CourseHomework.vue")['default']>
export const LazyCourseList: LazyComponent<typeof import("../components/Course/List.vue")['default']>
export const LazyCourseNoteList: LazyComponent<typeof import("../components/Course/NoteList.vue")['default']>
export const LazyCourseProgressTracker: LazyComponent<typeof import("../components/Course/ProgressTracker.vue")['default']>
export const LazyCourseVideoPlayer: LazyComponent<typeof import("../components/Course/VideoPlayer.vue")['default']>
export const LazyLecturerList: LazyComponent<typeof import("../components/Lecturer/List.vue")['default']>
export const LazyWorksWorkUpload: LazyComponent<typeof import("../components/Works/WorkUpload.vue")['default']>
export const LazyWorksWorkWall: LazyComponent<typeof import("../components/Works/WorkWall.vue")['default']>
export const LazyZoneCategory: LazyComponent<typeof import("../components/Zone/Category.vue")['default']>
export const LazyZoneCourse: LazyComponent<typeof import("../components/Zone/Course.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyElAffix: LazyComponent<typeof import("element-plus/es/components/affix/index")['ElAffix']>
export const LazyElAlert: LazyComponent<typeof import("element-plus/es/components/alert/index")['ElAlert']>
export const LazyElAutocomplete: LazyComponent<typeof import("element-plus/es/components/autocomplete/index")['ElAutocomplete']>
export const LazyElAutoResizer: LazyComponent<typeof import("element-plus/es/components/table-v2/index")['ElAutoResizer']>
export const LazyElAvatar: LazyComponent<typeof import("element-plus/es/components/avatar/index")['ElAvatar']>
export const LazyElBacktop: LazyComponent<typeof import("element-plus/es/components/backtop/index")['ElBacktop']>
export const LazyElBadge: LazyComponent<typeof import("element-plus/es/components/badge/index")['ElBadge']>
export const LazyElBreadcrumb: LazyComponent<typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumb']>
export const LazyElBreadcrumbItem: LazyComponent<typeof import("element-plus/es/components/breadcrumb/index")['ElBreadcrumbItem']>
export const LazyElButton: LazyComponent<typeof import("element-plus/es/components/button/index")['ElButton']>
export const LazyElButtonGroup: LazyComponent<typeof import("element-plus/es/components/button/index")['ElButtonGroup']>
export const LazyElCalendar: LazyComponent<typeof import("element-plus/es/components/calendar/index")['ElCalendar']>
export const LazyElCard: LazyComponent<typeof import("element-plus/es/components/card/index")['ElCard']>
export const LazyElCarousel: LazyComponent<typeof import("element-plus/es/components/carousel/index")['ElCarousel']>
export const LazyElCarouselItem: LazyComponent<typeof import("element-plus/es/components/carousel/index")['ElCarouselItem']>
export const LazyElCascader: LazyComponent<typeof import("element-plus/es/components/cascader/index")['ElCascader']>
export const LazyElCascaderPanel: LazyComponent<typeof import("element-plus/es/components/cascader-panel/index")['ElCascaderPanel']>
export const LazyElCheckTag: LazyComponent<typeof import("element-plus/es/components/check-tag/index")['ElCheckTag']>
export const LazyElCheckbox: LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckbox']>
export const LazyElCheckboxButton: LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckboxButton']>
export const LazyElCheckboxGroup: LazyComponent<typeof import("element-plus/es/components/checkbox/index")['ElCheckboxGroup']>
export const LazyElCol: LazyComponent<typeof import("element-plus/es/components/col/index")['ElCol']>
export const LazyElCollapse: LazyComponent<typeof import("element-plus/es/components/collapse/index")['ElCollapse']>
export const LazyElCollapseItem: LazyComponent<typeof import("element-plus/es/components/collapse/index")['ElCollapseItem']>
export const LazyElCollapseTransition: LazyComponent<typeof import("element-plus/es/components/collapse-transition/index")['ElCollapseTransition']>
export const LazyElColorPicker: LazyComponent<typeof import("element-plus/es/components/color-picker/index")['ElColorPicker']>
export const LazyElConfigProvider: LazyComponent<typeof import("element-plus/es/components/config-provider/index")['ElConfigProvider']>
export const LazyElContainer: LazyComponent<typeof import("element-plus/es/components/container/index")['ElContainer']>
export const LazyElAside: LazyComponent<typeof import("element-plus/es/components/container/index")['ElAside']>
export const LazyElFooter: LazyComponent<typeof import("element-plus/es/components/container/index")['ElFooter']>
export const LazyElHeader: LazyComponent<typeof import("element-plus/es/components/container/index")['ElHeader']>
export const LazyElMain: LazyComponent<typeof import("element-plus/es/components/container/index")['ElMain']>
export const LazyElDatePicker: LazyComponent<typeof import("element-plus/es/components/date-picker/index")['ElDatePicker']>
export const LazyElDescriptions: LazyComponent<typeof import("element-plus/es/components/descriptions/index")['ElDescriptions']>
export const LazyElDescriptionsItem: LazyComponent<typeof import("element-plus/es/components/descriptions/index")['ElDescriptionsItem']>
export const LazyElDialog: LazyComponent<typeof import("element-plus/es/components/dialog/index")['ElDialog']>
export const LazyElDivider: LazyComponent<typeof import("element-plus/es/components/divider/index")['ElDivider']>
export const LazyElDrawer: LazyComponent<typeof import("element-plus/es/components/drawer/index")['ElDrawer']>
export const LazyElDropdown: LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdown']>
export const LazyElDropdownItem: LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdownItem']>
export const LazyElDropdownMenu: LazyComponent<typeof import("element-plus/es/components/dropdown/index")['ElDropdownMenu']>
export const LazyElEmpty: LazyComponent<typeof import("element-plus/es/components/empty/index")['ElEmpty']>
export const LazyElForm: LazyComponent<typeof import("element-plus/es/components/form/index")['ElForm']>
export const LazyElFormItem: LazyComponent<typeof import("element-plus/es/components/form/index")['ElFormItem']>
export const LazyElIcon: LazyComponent<typeof import("element-plus/es/components/icon/index")['ElIcon']>
export const LazyElImage: LazyComponent<typeof import("element-plus/es/components/image/index")['ElImage']>
export const LazyElImageViewer: LazyComponent<typeof import("element-plus/es/components/image-viewer/index")['ElImageViewer']>
export const LazyElInput: LazyComponent<typeof import("element-plus/es/components/input/index")['ElInput']>
export const LazyElInputNumber: LazyComponent<typeof import("element-plus/es/components/input-number/index")['ElInputNumber']>
export const LazyElInputTag: LazyComponent<typeof import("element-plus/es/components/input-tag/index")['ElInputTag']>
export const LazyElLink: LazyComponent<typeof import("element-plus/es/components/link/index")['ElLink']>
export const LazyElMenu: LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenu']>
export const LazyElMenuItem: LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenuItem']>
export const LazyElMenuItemGroup: LazyComponent<typeof import("element-plus/es/components/menu/index")['ElMenuItemGroup']>
export const LazyElSubMenu: LazyComponent<typeof import("element-plus/es/components/menu/index")['ElSubMenu']>
export const LazyElPageHeader: LazyComponent<typeof import("element-plus/es/components/page-header/index")['ElPageHeader']>
export const LazyElPagination: LazyComponent<typeof import("element-plus/es/components/pagination/index")['ElPagination']>
export const LazyElPopconfirm: LazyComponent<typeof import("element-plus/es/components/popconfirm/index")['ElPopconfirm']>
export const LazyElPopover: LazyComponent<typeof import("element-plus/es/components/popover/index")['ElPopover']>
export const LazyElPopper: LazyComponent<typeof import("element-plus/es/components/popper/index")['ElPopper']>
export const LazyElProgress: LazyComponent<typeof import("element-plus/es/components/progress/index")['ElProgress']>
export const LazyElRadio: LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadio']>
export const LazyElRadioButton: LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadioButton']>
export const LazyElRadioGroup: LazyComponent<typeof import("element-plus/es/components/radio/index")['ElRadioGroup']>
export const LazyElRate: LazyComponent<typeof import("element-plus/es/components/rate/index")['ElRate']>
export const LazyElResult: LazyComponent<typeof import("element-plus/es/components/result/index")['ElResult']>
export const LazyElRow: LazyComponent<typeof import("element-plus/es/components/row/index")['ElRow']>
export const LazyElScrollbar: LazyComponent<typeof import("element-plus/es/components/scrollbar/index")['ElScrollbar']>
export const LazyElSelect: LazyComponent<typeof import("element-plus/es/components/select/index")['ElSelect']>
export const LazyElOption: LazyComponent<typeof import("element-plus/es/components/select/index")['ElOption']>
export const LazyElOptionGroup: LazyComponent<typeof import("element-plus/es/components/select/index")['ElOptionGroup']>
export const LazyElSelectV2: LazyComponent<typeof import("element-plus/es/components/select-v2/index")['ElSelectV2']>
export const LazyElSkeleton: LazyComponent<typeof import("element-plus/es/components/skeleton/index")['ElSkeleton']>
export const LazyElSkeletonItem: LazyComponent<typeof import("element-plus/es/components/skeleton/index")['ElSkeletonItem']>
export const LazyElSlider: LazyComponent<typeof import("element-plus/es/components/slider/index")['ElSlider']>
export const LazyElSpace: LazyComponent<typeof import("element-plus/es/components/space/index")['ElSpace']>
export const LazyElStatistic: LazyComponent<typeof import("element-plus/es/components/statistic/index")['ElStatistic']>
export const LazyElCountdown: LazyComponent<typeof import("element-plus/es/components/countdown/index")['ElCountdown']>
export const LazyElSteps: LazyComponent<typeof import("element-plus/es/components/steps/index")['ElSteps']>
export const LazyElStep: LazyComponent<typeof import("element-plus/es/components/steps/index")['ElStep']>
export const LazyElSwitch: LazyComponent<typeof import("element-plus/es/components/switch/index")['ElSwitch']>
export const LazyElTable: LazyComponent<typeof import("element-plus/es/components/table/index")['ElTable']>
export const LazyElTableColumn: LazyComponent<typeof import("element-plus/es/components/table/index")['ElTableColumn']>
export const LazyElTableV2: LazyComponent<typeof import("element-plus/es/components/table-v2/index")['ElTableV2']>
export const LazyElTabs: LazyComponent<typeof import("element-plus/es/components/tabs/index")['ElTabs']>
export const LazyElTabPane: LazyComponent<typeof import("element-plus/es/components/tabs/index")['ElTabPane']>
export const LazyElTag: LazyComponent<typeof import("element-plus/es/components/tag/index")['ElTag']>
export const LazyElText: LazyComponent<typeof import("element-plus/es/components/text/index")['ElText']>
export const LazyElTimePicker: LazyComponent<typeof import("element-plus/es/components/time-picker/index")['ElTimePicker']>
export const LazyElTimeSelect: LazyComponent<typeof import("element-plus/es/components/time-select/index")['ElTimeSelect']>
export const LazyElTimeline: LazyComponent<typeof import("element-plus/es/components/timeline/index")['ElTimeline']>
export const LazyElTimelineItem: LazyComponent<typeof import("element-plus/es/components/timeline/index")['ElTimelineItem']>
export const LazyElTooltip: LazyComponent<typeof import("element-plus/es/components/tooltip/index")['ElTooltip']>
export const LazyElTooltipV2: LazyComponent<typeof import("element-plus/es/components/tooltip-v2/index")['ElTooltipV2']>
export const LazyElTransfer: LazyComponent<typeof import("element-plus/es/components/transfer/index")['ElTransfer']>
export const LazyElTree: LazyComponent<typeof import("element-plus/es/components/tree/index")['ElTree']>
export const LazyElTreeSelect: LazyComponent<typeof import("element-plus/es/components/tree-select/index")['ElTreeSelect']>
export const LazyElTreeV2: LazyComponent<typeof import("element-plus/es/components/tree-v2/index")['ElTreeV2']>
export const LazyElUpload: LazyComponent<typeof import("element-plus/es/components/upload/index")['ElUpload']>
export const LazyElWatermark: LazyComponent<typeof import("element-plus/es/components/watermark/index")['ElWatermark']>
export const LazyElTour: LazyComponent<typeof import("element-plus/es/components/tour/index")['ElTour']>
export const LazyElTourStep: LazyComponent<typeof import("element-plus/es/components/tour/index")['ElTourStep']>
export const LazyElAnchor: LazyComponent<typeof import("element-plus/es/components/anchor/index")['ElAnchor']>
export const LazyElAnchorLink: LazyComponent<typeof import("element-plus/es/components/anchor/index")['ElAnchorLink']>
export const LazyElSegmented: LazyComponent<typeof import("element-plus/es/components/segmented/index")['ElSegmented']>
export const LazyElMention: LazyComponent<typeof import("element-plus/es/components/mention/index")['ElMention']>
export const LazyElIconAddLocation: LazyComponent<typeof import("@element-plus/icons-vue")['AddLocation']>
export const LazyElIconAim: LazyComponent<typeof import("@element-plus/icons-vue")['Aim']>
export const LazyElIconAlarmClock: LazyComponent<typeof import("@element-plus/icons-vue")['AlarmClock']>
export const LazyElIconApple: LazyComponent<typeof import("@element-plus/icons-vue")['Apple']>
export const LazyElIconArrowDown: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowDown']>
export const LazyElIconArrowDownBold: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowDownBold']>
export const LazyElIconArrowLeft: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowLeft']>
export const LazyElIconArrowLeftBold: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowLeftBold']>
export const LazyElIconArrowRight: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowRight']>
export const LazyElIconArrowRightBold: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowRightBold']>
export const LazyElIconArrowUp: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowUp']>
export const LazyElIconArrowUpBold: LazyComponent<typeof import("@element-plus/icons-vue")['ArrowUpBold']>
export const LazyElIconAvatar: LazyComponent<typeof import("@element-plus/icons-vue")['Avatar']>
export const LazyElIconBack: LazyComponent<typeof import("@element-plus/icons-vue")['Back']>
export const LazyElIconBaseball: LazyComponent<typeof import("@element-plus/icons-vue")['Baseball']>
export const LazyElIconBasketball: LazyComponent<typeof import("@element-plus/icons-vue")['Basketball']>
export const LazyElIconBell: LazyComponent<typeof import("@element-plus/icons-vue")['Bell']>
export const LazyElIconBellFilled: LazyComponent<typeof import("@element-plus/icons-vue")['BellFilled']>
export const LazyElIconBicycle: LazyComponent<typeof import("@element-plus/icons-vue")['Bicycle']>
export const LazyElIconBottom: LazyComponent<typeof import("@element-plus/icons-vue")['Bottom']>
export const LazyElIconBottomLeft: LazyComponent<typeof import("@element-plus/icons-vue")['BottomLeft']>
export const LazyElIconBottomRight: LazyComponent<typeof import("@element-plus/icons-vue")['BottomRight']>
export const LazyElIconBowl: LazyComponent<typeof import("@element-plus/icons-vue")['Bowl']>
export const LazyElIconBox: LazyComponent<typeof import("@element-plus/icons-vue")['Box']>
export const LazyElIconBriefcase: LazyComponent<typeof import("@element-plus/icons-vue")['Briefcase']>
export const LazyElIconBrush: LazyComponent<typeof import("@element-plus/icons-vue")['Brush']>
export const LazyElIconBrushFilled: LazyComponent<typeof import("@element-plus/icons-vue")['BrushFilled']>
export const LazyElIconBurger: LazyComponent<typeof import("@element-plus/icons-vue")['Burger']>
export const LazyElIconCalendar: LazyComponent<typeof import("@element-plus/icons-vue")['Calendar']>
export const LazyElIconCamera: LazyComponent<typeof import("@element-plus/icons-vue")['Camera']>
export const LazyElIconCameraFilled: LazyComponent<typeof import("@element-plus/icons-vue")['CameraFilled']>
export const LazyElIconCaretBottom: LazyComponent<typeof import("@element-plus/icons-vue")['CaretBottom']>
export const LazyElIconCaretLeft: LazyComponent<typeof import("@element-plus/icons-vue")['CaretLeft']>
export const LazyElIconCaretRight: LazyComponent<typeof import("@element-plus/icons-vue")['CaretRight']>
export const LazyElIconCaretTop: LazyComponent<typeof import("@element-plus/icons-vue")['CaretTop']>
export const LazyElIconCellphone: LazyComponent<typeof import("@element-plus/icons-vue")['Cellphone']>
export const LazyElIconChatDotRound: LazyComponent<typeof import("@element-plus/icons-vue")['ChatDotRound']>
export const LazyElIconChatDotSquare: LazyComponent<typeof import("@element-plus/icons-vue")['ChatDotSquare']>
export const LazyElIconChatLineRound: LazyComponent<typeof import("@element-plus/icons-vue")['ChatLineRound']>
export const LazyElIconChatLineSquare: LazyComponent<typeof import("@element-plus/icons-vue")['ChatLineSquare']>
export const LazyElIconChatRound: LazyComponent<typeof import("@element-plus/icons-vue")['ChatRound']>
export const LazyElIconChatSquare: LazyComponent<typeof import("@element-plus/icons-vue")['ChatSquare']>
export const LazyElIconCheck: LazyComponent<typeof import("@element-plus/icons-vue")['Check']>
export const LazyElIconChecked: LazyComponent<typeof import("@element-plus/icons-vue")['Checked']>
export const LazyElIconCherry: LazyComponent<typeof import("@element-plus/icons-vue")['Cherry']>
export const LazyElIconChicken: LazyComponent<typeof import("@element-plus/icons-vue")['Chicken']>
export const LazyElIconChromeFilled: LazyComponent<typeof import("@element-plus/icons-vue")['ChromeFilled']>
export const LazyElIconCircleCheck: LazyComponent<typeof import("@element-plus/icons-vue")['CircleCheck']>
export const LazyElIconCircleCheckFilled: LazyComponent<typeof import("@element-plus/icons-vue")['CircleCheckFilled']>
export const LazyElIconCircleClose: LazyComponent<typeof import("@element-plus/icons-vue")['CircleClose']>
export const LazyElIconCircleCloseFilled: LazyComponent<typeof import("@element-plus/icons-vue")['CircleCloseFilled']>
export const LazyElIconCirclePlus: LazyComponent<typeof import("@element-plus/icons-vue")['CirclePlus']>
export const LazyElIconCirclePlusFilled: LazyComponent<typeof import("@element-plus/icons-vue")['CirclePlusFilled']>
export const LazyElIconClock: LazyComponent<typeof import("@element-plus/icons-vue")['Clock']>
export const LazyElIconClose: LazyComponent<typeof import("@element-plus/icons-vue")['Close']>
export const LazyElIconCloseBold: LazyComponent<typeof import("@element-plus/icons-vue")['CloseBold']>
export const LazyElIconCloudy: LazyComponent<typeof import("@element-plus/icons-vue")['Cloudy']>
export const LazyElIconCoffee: LazyComponent<typeof import("@element-plus/icons-vue")['Coffee']>
export const LazyElIconCoffeeCup: LazyComponent<typeof import("@element-plus/icons-vue")['CoffeeCup']>
export const LazyElIconCoin: LazyComponent<typeof import("@element-plus/icons-vue")['Coin']>
export const LazyElIconColdDrink: LazyComponent<typeof import("@element-plus/icons-vue")['ColdDrink']>
export const LazyElIconCollection: LazyComponent<typeof import("@element-plus/icons-vue")['Collection']>
export const LazyElIconCollectionTag: LazyComponent<typeof import("@element-plus/icons-vue")['CollectionTag']>
export const LazyElIconComment: LazyComponent<typeof import("@element-plus/icons-vue")['Comment']>
export const LazyElIconCompass: LazyComponent<typeof import("@element-plus/icons-vue")['Compass']>
export const LazyElIconConnection: LazyComponent<typeof import("@element-plus/icons-vue")['Connection']>
export const LazyElIconCoordinate: LazyComponent<typeof import("@element-plus/icons-vue")['Coordinate']>
export const LazyElIconCopyDocument: LazyComponent<typeof import("@element-plus/icons-vue")['CopyDocument']>
export const LazyElIconCpu: LazyComponent<typeof import("@element-plus/icons-vue")['Cpu']>
export const LazyElIconCreditCard: LazyComponent<typeof import("@element-plus/icons-vue")['CreditCard']>
export const LazyElIconCrop: LazyComponent<typeof import("@element-plus/icons-vue")['Crop']>
export const LazyElIconDArrowLeft: LazyComponent<typeof import("@element-plus/icons-vue")['DArrowLeft']>
export const LazyElIconDArrowRight: LazyComponent<typeof import("@element-plus/icons-vue")['DArrowRight']>
export const LazyElIconDCaret: LazyComponent<typeof import("@element-plus/icons-vue")['DCaret']>
export const LazyElIconDataAnalysis: LazyComponent<typeof import("@element-plus/icons-vue")['DataAnalysis']>
export const LazyElIconDataBoard: LazyComponent<typeof import("@element-plus/icons-vue")['DataBoard']>
export const LazyElIconDataLine: LazyComponent<typeof import("@element-plus/icons-vue")['DataLine']>
export const LazyElIconDelete: LazyComponent<typeof import("@element-plus/icons-vue")['Delete']>
export const LazyElIconDeleteFilled: LazyComponent<typeof import("@element-plus/icons-vue")['DeleteFilled']>
export const LazyElIconDeleteLocation: LazyComponent<typeof import("@element-plus/icons-vue")['DeleteLocation']>
export const LazyElIconDessert: LazyComponent<typeof import("@element-plus/icons-vue")['Dessert']>
export const LazyElIconDiscount: LazyComponent<typeof import("@element-plus/icons-vue")['Discount']>
export const LazyElIconDish: LazyComponent<typeof import("@element-plus/icons-vue")['Dish']>
export const LazyElIconDishDot: LazyComponent<typeof import("@element-plus/icons-vue")['DishDot']>
export const LazyElIconDocument: LazyComponent<typeof import("@element-plus/icons-vue")['Document']>
export const LazyElIconDocumentAdd: LazyComponent<typeof import("@element-plus/icons-vue")['DocumentAdd']>
export const LazyElIconDocumentChecked: LazyComponent<typeof import("@element-plus/icons-vue")['DocumentChecked']>
export const LazyElIconDocumentCopy: LazyComponent<typeof import("@element-plus/icons-vue")['DocumentCopy']>
export const LazyElIconDocumentDelete: LazyComponent<typeof import("@element-plus/icons-vue")['DocumentDelete']>
export const LazyElIconDocumentRemove: LazyComponent<typeof import("@element-plus/icons-vue")['DocumentRemove']>
export const LazyElIconDownload: LazyComponent<typeof import("@element-plus/icons-vue")['Download']>
export const LazyElIconDrizzling: LazyComponent<typeof import("@element-plus/icons-vue")['Drizzling']>
export const LazyElIconEdit: LazyComponent<typeof import("@element-plus/icons-vue")['Edit']>
export const LazyElIconEditPen: LazyComponent<typeof import("@element-plus/icons-vue")['EditPen']>
export const LazyElIconEleme: LazyComponent<typeof import("@element-plus/icons-vue")['Eleme']>
export const LazyElIconElemeFilled: LazyComponent<typeof import("@element-plus/icons-vue")['ElemeFilled']>
export const LazyElIconElementPlus: LazyComponent<typeof import("@element-plus/icons-vue")['ElementPlus']>
export const LazyElIconExpand: LazyComponent<typeof import("@element-plus/icons-vue")['Expand']>
export const LazyElIconFailed: LazyComponent<typeof import("@element-plus/icons-vue")['Failed']>
export const LazyElIconFemale: LazyComponent<typeof import("@element-plus/icons-vue")['Female']>
export const LazyElIconFiles: LazyComponent<typeof import("@element-plus/icons-vue")['Files']>
export const LazyElIconFilm: LazyComponent<typeof import("@element-plus/icons-vue")['Film']>
export const LazyElIconFilter: LazyComponent<typeof import("@element-plus/icons-vue")['Filter']>
export const LazyElIconFinished: LazyComponent<typeof import("@element-plus/icons-vue")['Finished']>
export const LazyElIconFirstAidKit: LazyComponent<typeof import("@element-plus/icons-vue")['FirstAidKit']>
export const LazyElIconFlag: LazyComponent<typeof import("@element-plus/icons-vue")['Flag']>
export const LazyElIconFold: LazyComponent<typeof import("@element-plus/icons-vue")['Fold']>
export const LazyElIconFolder: LazyComponent<typeof import("@element-plus/icons-vue")['Folder']>
export const LazyElIconFolderAdd: LazyComponent<typeof import("@element-plus/icons-vue")['FolderAdd']>
export const LazyElIconFolderChecked: LazyComponent<typeof import("@element-plus/icons-vue")['FolderChecked']>
export const LazyElIconFolderDelete: LazyComponent<typeof import("@element-plus/icons-vue")['FolderDelete']>
export const LazyElIconFolderOpened: LazyComponent<typeof import("@element-plus/icons-vue")['FolderOpened']>
export const LazyElIconFolderRemove: LazyComponent<typeof import("@element-plus/icons-vue")['FolderRemove']>
export const LazyElIconFood: LazyComponent<typeof import("@element-plus/icons-vue")['Food']>
export const LazyElIconFootball: LazyComponent<typeof import("@element-plus/icons-vue")['Football']>
export const LazyElIconForkSpoon: LazyComponent<typeof import("@element-plus/icons-vue")['ForkSpoon']>
export const LazyElIconFries: LazyComponent<typeof import("@element-plus/icons-vue")['Fries']>
export const LazyElIconFullScreen: LazyComponent<typeof import("@element-plus/icons-vue")['FullScreen']>
export const LazyElIconGoblet: LazyComponent<typeof import("@element-plus/icons-vue")['Goblet']>
export const LazyElIconGobletFull: LazyComponent<typeof import("@element-plus/icons-vue")['GobletFull']>
export const LazyElIconGobletSquare: LazyComponent<typeof import("@element-plus/icons-vue")['GobletSquare']>
export const LazyElIconGobletSquareFull: LazyComponent<typeof import("@element-plus/icons-vue")['GobletSquareFull']>
export const LazyElIconGoldMedal: LazyComponent<typeof import("@element-plus/icons-vue")['GoldMedal']>
export const LazyElIconGoods: LazyComponent<typeof import("@element-plus/icons-vue")['Goods']>
export const LazyElIconGoodsFilled: LazyComponent<typeof import("@element-plus/icons-vue")['GoodsFilled']>
export const LazyElIconGrape: LazyComponent<typeof import("@element-plus/icons-vue")['Grape']>
export const LazyElIconGrid: LazyComponent<typeof import("@element-plus/icons-vue")['Grid']>
export const LazyElIconGuide: LazyComponent<typeof import("@element-plus/icons-vue")['Guide']>
export const LazyElIconHandbag: LazyComponent<typeof import("@element-plus/icons-vue")['Handbag']>
export const LazyElIconHeadset: LazyComponent<typeof import("@element-plus/icons-vue")['Headset']>
export const LazyElIconHelp: LazyComponent<typeof import("@element-plus/icons-vue")['Help']>
export const LazyElIconHelpFilled: LazyComponent<typeof import("@element-plus/icons-vue")['HelpFilled']>
export const LazyElIconHide: LazyComponent<typeof import("@element-plus/icons-vue")['Hide']>
export const LazyElIconHistogram: LazyComponent<typeof import("@element-plus/icons-vue")['Histogram']>
export const LazyElIconHomeFilled: LazyComponent<typeof import("@element-plus/icons-vue")['HomeFilled']>
export const LazyElIconHotWater: LazyComponent<typeof import("@element-plus/icons-vue")['HotWater']>
export const LazyElIconHouse: LazyComponent<typeof import("@element-plus/icons-vue")['House']>
export const LazyElIconIceCream: LazyComponent<typeof import("@element-plus/icons-vue")['IceCream']>
export const LazyElIconIceCreamRound: LazyComponent<typeof import("@element-plus/icons-vue")['IceCreamRound']>
export const LazyElIconIceCreamSquare: LazyComponent<typeof import("@element-plus/icons-vue")['IceCreamSquare']>
export const LazyElIconIceDrink: LazyComponent<typeof import("@element-plus/icons-vue")['IceDrink']>
export const LazyElIconIceTea: LazyComponent<typeof import("@element-plus/icons-vue")['IceTea']>
export const LazyElIconInfoFilled: LazyComponent<typeof import("@element-plus/icons-vue")['InfoFilled']>
export const LazyElIconIphone: LazyComponent<typeof import("@element-plus/icons-vue")['Iphone']>
export const LazyElIconKey: LazyComponent<typeof import("@element-plus/icons-vue")['Key']>
export const LazyElIconKnifeFork: LazyComponent<typeof import("@element-plus/icons-vue")['KnifeFork']>
export const LazyElIconLightning: LazyComponent<typeof import("@element-plus/icons-vue")['Lightning']>
export const LazyElIconLink: LazyComponent<typeof import("@element-plus/icons-vue")['Link']>
export const LazyElIconList: LazyComponent<typeof import("@element-plus/icons-vue")['List']>
export const LazyElIconLoading: LazyComponent<typeof import("@element-plus/icons-vue")['Loading']>
export const LazyElIconLocation: LazyComponent<typeof import("@element-plus/icons-vue")['Location']>
export const LazyElIconLocationFilled: LazyComponent<typeof import("@element-plus/icons-vue")['LocationFilled']>
export const LazyElIconLocationInformation: LazyComponent<typeof import("@element-plus/icons-vue")['LocationInformation']>
export const LazyElIconLock: LazyComponent<typeof import("@element-plus/icons-vue")['Lock']>
export const LazyElIconLollipop: LazyComponent<typeof import("@element-plus/icons-vue")['Lollipop']>
export const LazyElIconMagicStick: LazyComponent<typeof import("@element-plus/icons-vue")['MagicStick']>
export const LazyElIconMagnet: LazyComponent<typeof import("@element-plus/icons-vue")['Magnet']>
export const LazyElIconMale: LazyComponent<typeof import("@element-plus/icons-vue")['Male']>
export const LazyElIconManagement: LazyComponent<typeof import("@element-plus/icons-vue")['Management']>
export const LazyElIconMapLocation: LazyComponent<typeof import("@element-plus/icons-vue")['MapLocation']>
export const LazyElIconMedal: LazyComponent<typeof import("@element-plus/icons-vue")['Medal']>
export const LazyElIconMemo: LazyComponent<typeof import("@element-plus/icons-vue")['Memo']>
export const LazyElIconMenu: LazyComponent<typeof import("@element-plus/icons-vue")['Menu']>
export const LazyElIconMessage: LazyComponent<typeof import("@element-plus/icons-vue")['Message']>
export const LazyElIconMessageBox: LazyComponent<typeof import("@element-plus/icons-vue")['MessageBox']>
export const LazyElIconMic: LazyComponent<typeof import("@element-plus/icons-vue")['Mic']>
export const LazyElIconMicrophone: LazyComponent<typeof import("@element-plus/icons-vue")['Microphone']>
export const LazyElIconMilkTea: LazyComponent<typeof import("@element-plus/icons-vue")['MilkTea']>
export const LazyElIconMinus: LazyComponent<typeof import("@element-plus/icons-vue")['Minus']>
export const LazyElIconMoney: LazyComponent<typeof import("@element-plus/icons-vue")['Money']>
export const LazyElIconMonitor: LazyComponent<typeof import("@element-plus/icons-vue")['Monitor']>
export const LazyElIconMoon: LazyComponent<typeof import("@element-plus/icons-vue")['Moon']>
export const LazyElIconMoonNight: LazyComponent<typeof import("@element-plus/icons-vue")['MoonNight']>
export const LazyElIconMore: LazyComponent<typeof import("@element-plus/icons-vue")['More']>
export const LazyElIconMoreFilled: LazyComponent<typeof import("@element-plus/icons-vue")['MoreFilled']>
export const LazyElIconMostlyCloudy: LazyComponent<typeof import("@element-plus/icons-vue")['MostlyCloudy']>
export const LazyElIconMouse: LazyComponent<typeof import("@element-plus/icons-vue")['Mouse']>
export const LazyElIconMug: LazyComponent<typeof import("@element-plus/icons-vue")['Mug']>
export const LazyElIconMute: LazyComponent<typeof import("@element-plus/icons-vue")['Mute']>
export const LazyElIconMuteNotification: LazyComponent<typeof import("@element-plus/icons-vue")['MuteNotification']>
export const LazyElIconNoSmoking: LazyComponent<typeof import("@element-plus/icons-vue")['NoSmoking']>
export const LazyElIconNotebook: LazyComponent<typeof import("@element-plus/icons-vue")['Notebook']>
export const LazyElIconNotification: LazyComponent<typeof import("@element-plus/icons-vue")['Notification']>
export const LazyElIconOdometer: LazyComponent<typeof import("@element-plus/icons-vue")['Odometer']>
export const LazyElIconOfficeBuilding: LazyComponent<typeof import("@element-plus/icons-vue")['OfficeBuilding']>
export const LazyElIconOpen: LazyComponent<typeof import("@element-plus/icons-vue")['Open']>
export const LazyElIconOperation: LazyComponent<typeof import("@element-plus/icons-vue")['Operation']>
export const LazyElIconOpportunity: LazyComponent<typeof import("@element-plus/icons-vue")['Opportunity']>
export const LazyElIconOrange: LazyComponent<typeof import("@element-plus/icons-vue")['Orange']>
export const LazyElIconPaperclip: LazyComponent<typeof import("@element-plus/icons-vue")['Paperclip']>
export const LazyElIconPartlyCloudy: LazyComponent<typeof import("@element-plus/icons-vue")['PartlyCloudy']>
export const LazyElIconPear: LazyComponent<typeof import("@element-plus/icons-vue")['Pear']>
export const LazyElIconPhone: LazyComponent<typeof import("@element-plus/icons-vue")['Phone']>
export const LazyElIconPhoneFilled: LazyComponent<typeof import("@element-plus/icons-vue")['PhoneFilled']>
export const LazyElIconPicture: LazyComponent<typeof import("@element-plus/icons-vue")['Picture']>
export const LazyElIconPictureFilled: LazyComponent<typeof import("@element-plus/icons-vue")['PictureFilled']>
export const LazyElIconPictureRounded: LazyComponent<typeof import("@element-plus/icons-vue")['PictureRounded']>
export const LazyElIconPieChart: LazyComponent<typeof import("@element-plus/icons-vue")['PieChart']>
export const LazyElIconPlace: LazyComponent<typeof import("@element-plus/icons-vue")['Place']>
export const LazyElIconPlatform: LazyComponent<typeof import("@element-plus/icons-vue")['Platform']>
export const LazyElIconPlus: LazyComponent<typeof import("@element-plus/icons-vue")['Plus']>
export const LazyElIconPointer: LazyComponent<typeof import("@element-plus/icons-vue")['Pointer']>
export const LazyElIconPosition: LazyComponent<typeof import("@element-plus/icons-vue")['Position']>
export const LazyElIconPostcard: LazyComponent<typeof import("@element-plus/icons-vue")['Postcard']>
export const LazyElIconPouring: LazyComponent<typeof import("@element-plus/icons-vue")['Pouring']>
export const LazyElIconPresent: LazyComponent<typeof import("@element-plus/icons-vue")['Present']>
export const LazyElIconPriceTag: LazyComponent<typeof import("@element-plus/icons-vue")['PriceTag']>
export const LazyElIconPrinter: LazyComponent<typeof import("@element-plus/icons-vue")['Printer']>
export const LazyElIconPromotion: LazyComponent<typeof import("@element-plus/icons-vue")['Promotion']>
export const LazyElIconQuartzWatch: LazyComponent<typeof import("@element-plus/icons-vue")['QuartzWatch']>
export const LazyElIconQuestionFilled: LazyComponent<typeof import("@element-plus/icons-vue")['QuestionFilled']>
export const LazyElIconRank: LazyComponent<typeof import("@element-plus/icons-vue")['Rank']>
export const LazyElIconReading: LazyComponent<typeof import("@element-plus/icons-vue")['Reading']>
export const LazyElIconReadingLamp: LazyComponent<typeof import("@element-plus/icons-vue")['ReadingLamp']>
export const LazyElIconRefresh: LazyComponent<typeof import("@element-plus/icons-vue")['Refresh']>
export const LazyElIconRefreshLeft: LazyComponent<typeof import("@element-plus/icons-vue")['RefreshLeft']>
export const LazyElIconRefreshRight: LazyComponent<typeof import("@element-plus/icons-vue")['RefreshRight']>
export const LazyElIconRefrigerator: LazyComponent<typeof import("@element-plus/icons-vue")['Refrigerator']>
export const LazyElIconRemove: LazyComponent<typeof import("@element-plus/icons-vue")['Remove']>
export const LazyElIconRemoveFilled: LazyComponent<typeof import("@element-plus/icons-vue")['RemoveFilled']>
export const LazyElIconRight: LazyComponent<typeof import("@element-plus/icons-vue")['Right']>
export const LazyElIconScaleToOriginal: LazyComponent<typeof import("@element-plus/icons-vue")['ScaleToOriginal']>
export const LazyElIconSchool: LazyComponent<typeof import("@element-plus/icons-vue")['School']>
export const LazyElIconScissor: LazyComponent<typeof import("@element-plus/icons-vue")['Scissor']>
export const LazyElIconSearch: LazyComponent<typeof import("@element-plus/icons-vue")['Search']>
export const LazyElIconSelect: LazyComponent<typeof import("@element-plus/icons-vue")['Select']>
export const LazyElIconSell: LazyComponent<typeof import("@element-plus/icons-vue")['Sell']>
export const LazyElIconSemiSelect: LazyComponent<typeof import("@element-plus/icons-vue")['SemiSelect']>
export const LazyElIconService: LazyComponent<typeof import("@element-plus/icons-vue")['Service']>
export const LazyElIconSetUp: LazyComponent<typeof import("@element-plus/icons-vue")['SetUp']>
export const LazyElIconSetting: LazyComponent<typeof import("@element-plus/icons-vue")['Setting']>
export const LazyElIconShare: LazyComponent<typeof import("@element-plus/icons-vue")['Share']>
export const LazyElIconShip: LazyComponent<typeof import("@element-plus/icons-vue")['Ship']>
export const LazyElIconShop: LazyComponent<typeof import("@element-plus/icons-vue")['Shop']>
export const LazyElIconShoppingBag: LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingBag']>
export const LazyElIconShoppingCart: LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingCart']>
export const LazyElIconShoppingCartFull: LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingCartFull']>
export const LazyElIconShoppingTrolley: LazyComponent<typeof import("@element-plus/icons-vue")['ShoppingTrolley']>
export const LazyElIconSmoking: LazyComponent<typeof import("@element-plus/icons-vue")['Smoking']>
export const LazyElIconSoccer: LazyComponent<typeof import("@element-plus/icons-vue")['Soccer']>
export const LazyElIconSoldOut: LazyComponent<typeof import("@element-plus/icons-vue")['SoldOut']>
export const LazyElIconSort: LazyComponent<typeof import("@element-plus/icons-vue")['Sort']>
export const LazyElIconSortDown: LazyComponent<typeof import("@element-plus/icons-vue")['SortDown']>
export const LazyElIconSortUp: LazyComponent<typeof import("@element-plus/icons-vue")['SortUp']>
export const LazyElIconStamp: LazyComponent<typeof import("@element-plus/icons-vue")['Stamp']>
export const LazyElIconStar: LazyComponent<typeof import("@element-plus/icons-vue")['Star']>
export const LazyElIconStarFilled: LazyComponent<typeof import("@element-plus/icons-vue")['StarFilled']>
export const LazyElIconStopwatch: LazyComponent<typeof import("@element-plus/icons-vue")['Stopwatch']>
export const LazyElIconSuccessFilled: LazyComponent<typeof import("@element-plus/icons-vue")['SuccessFilled']>
export const LazyElIconSugar: LazyComponent<typeof import("@element-plus/icons-vue")['Sugar']>
export const LazyElIconSuitcase: LazyComponent<typeof import("@element-plus/icons-vue")['Suitcase']>
export const LazyElIconSuitcaseLine: LazyComponent<typeof import("@element-plus/icons-vue")['SuitcaseLine']>
export const LazyElIconSunny: LazyComponent<typeof import("@element-plus/icons-vue")['Sunny']>
export const LazyElIconSunrise: LazyComponent<typeof import("@element-plus/icons-vue")['Sunrise']>
export const LazyElIconSunset: LazyComponent<typeof import("@element-plus/icons-vue")['Sunset']>
export const LazyElIconSwitch: LazyComponent<typeof import("@element-plus/icons-vue")['Switch']>
export const LazyElIconSwitchButton: LazyComponent<typeof import("@element-plus/icons-vue")['SwitchButton']>
export const LazyElIconSwitchFilled: LazyComponent<typeof import("@element-plus/icons-vue")['SwitchFilled']>
export const LazyElIconTakeawayBox: LazyComponent<typeof import("@element-plus/icons-vue")['TakeawayBox']>
export const LazyElIconTicket: LazyComponent<typeof import("@element-plus/icons-vue")['Ticket']>
export const LazyElIconTickets: LazyComponent<typeof import("@element-plus/icons-vue")['Tickets']>
export const LazyElIconTimer: LazyComponent<typeof import("@element-plus/icons-vue")['Timer']>
export const LazyElIconToiletPaper: LazyComponent<typeof import("@element-plus/icons-vue")['ToiletPaper']>
export const LazyElIconTools: LazyComponent<typeof import("@element-plus/icons-vue")['Tools']>
export const LazyElIconTop: LazyComponent<typeof import("@element-plus/icons-vue")['Top']>
export const LazyElIconTopLeft: LazyComponent<typeof import("@element-plus/icons-vue")['TopLeft']>
export const LazyElIconTopRight: LazyComponent<typeof import("@element-plus/icons-vue")['TopRight']>
export const LazyElIconTrendCharts: LazyComponent<typeof import("@element-plus/icons-vue")['TrendCharts']>
export const LazyElIconTrophy: LazyComponent<typeof import("@element-plus/icons-vue")['Trophy']>
export const LazyElIconTrophyBase: LazyComponent<typeof import("@element-plus/icons-vue")['TrophyBase']>
export const LazyElIconTurnOff: LazyComponent<typeof import("@element-plus/icons-vue")['TurnOff']>
export const LazyElIconUmbrella: LazyComponent<typeof import("@element-plus/icons-vue")['Umbrella']>
export const LazyElIconUnlock: LazyComponent<typeof import("@element-plus/icons-vue")['Unlock']>
export const LazyElIconUpload: LazyComponent<typeof import("@element-plus/icons-vue")['Upload']>
export const LazyElIconUploadFilled: LazyComponent<typeof import("@element-plus/icons-vue")['UploadFilled']>
export const LazyElIconUser: LazyComponent<typeof import("@element-plus/icons-vue")['User']>
export const LazyElIconUserFilled: LazyComponent<typeof import("@element-plus/icons-vue")['UserFilled']>
export const LazyElIconVan: LazyComponent<typeof import("@element-plus/icons-vue")['Van']>
export const LazyElIconVideoCamera: LazyComponent<typeof import("@element-plus/icons-vue")['VideoCamera']>
export const LazyElIconVideoCameraFilled: LazyComponent<typeof import("@element-plus/icons-vue")['VideoCameraFilled']>
export const LazyElIconVideoPause: LazyComponent<typeof import("@element-plus/icons-vue")['VideoPause']>
export const LazyElIconVideoPlay: LazyComponent<typeof import("@element-plus/icons-vue")['VideoPlay']>
export const LazyElIconView: LazyComponent<typeof import("@element-plus/icons-vue")['View']>
export const LazyElIconWallet: LazyComponent<typeof import("@element-plus/icons-vue")['Wallet']>
export const LazyElIconWalletFilled: LazyComponent<typeof import("@element-plus/icons-vue")['WalletFilled']>
export const LazyElIconWarnTriangleFilled: LazyComponent<typeof import("@element-plus/icons-vue")['WarnTriangleFilled']>
export const LazyElIconWarning: LazyComponent<typeof import("@element-plus/icons-vue")['Warning']>
export const LazyElIconWarningFilled: LazyComponent<typeof import("@element-plus/icons-vue")['WarningFilled']>
export const LazyElIconWatch: LazyComponent<typeof import("@element-plus/icons-vue")['Watch']>
export const LazyElIconWatermelon: LazyComponent<typeof import("@element-plus/icons-vue")['Watermelon']>
export const LazyElIconWindPower: LazyComponent<typeof import("@element-plus/icons-vue")['WindPower']>
export const LazyElIconZoomIn: LazyComponent<typeof import("@element-plus/icons-vue")['ZoomIn']>
export const LazyElIconZoomOut: LazyComponent<typeof import("@element-plus/icons-vue")['ZoomOut']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
