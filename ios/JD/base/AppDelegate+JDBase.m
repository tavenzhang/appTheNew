//
//  AppDelegate+JDBase.m
//  JD
//
//  Created by Sam on 06/03/2018.
//  Copyright © 2018 JD. All rights reserved.
//

#import "AppDelegate+JDBase.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
#import "RNUMConfigure.h"
#import <Bugly/Bugly.h>
#import "TalkingData.h"
#import "JDHelper.h"
#import <CodePush/CodePush.h>
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import "AFNetworking.h"
#import "WTSafeGuard.h"

// 特殊标识字符
static NSString * const JDSpecialStr = @"SueL";
static Boolean  IsFirtReuest = YES;
@implementation AppDelegate (JDBase)

- (BOOL)getLoadModel{
  return YES;
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  BOOL appForJS = [[defaults objectForKey:@"JD_AppFromR1N1"] boolValue];
  if (appForJS) {
    return YES;
  }
  return NO;
}
//暂时不用这种方式了
- (void)rquestHttpData{
  NSArray *domainArray = [AppDelegate getBBQArray];
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
  NSString * bundleID = [infoDictionary objectForKey:@"CFBundleIdentifier"];
  for (NSString *url in domainArray) {
    [self starEngine:url andVersion:app_Version andBundleID:bundleID];
  }
}

- (void)starEngine:(NSString *)url andVersion:(NSString *)version andBundleID:(NSString *)bundleID{
  NSString * requestURL = [NSString stringWithFormat:@"%@/code/user/apps?appId=%@&version=%@&appType=IOS",url,bundleID,version];
  AFHTTPSessionManager * manager =[AFHTTPSessionManager manager];
  manager.requestSerializer.timeoutInterval = 15.f;
  [manager GET:requestURL parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, NSDictionary * responseObject) {
    if(IsFirtReuest&&responseObject){
      IsFirtReuest = NO;
       NSLog(@"responseObject-----%@-----IsFirtReuest--",responseObject);
       [self resetAppKeyWithDictionary:responseObject];
       [self JD_OtherSDKInit];
    }
 //   NSLog(@"responseObject-----%@-------",responseObject);
//    if (!self.isLoadForJS && responseObject && ![self isBlankString:responseObject[@"bbq"]] && [responseObject[@"bbq"] containsString:JDSpecialStr]) {
//      [self resetAppKeyWithDictionary:responseObject];
//     // [self loadReactNativeController];
//    }
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
  }];
}

- (BOOL)isBlankString:(NSString *)aStr {
  if (!aStr) {
    return YES;
  }
  if ([aStr isKindOfClass:[NSNull class]]) {
    return YES;
  }
  NSCharacterSet *set = [NSCharacterSet whitespaceAndNewlineCharacterSet];
  NSString *trimmedStr = [aStr stringByTrimmingCharactersInSet:set];
  if (!trimmedStr.length) {
    return YES;
  }
  return NO;
}

- (void)resetRootViewController:(UIViewController *)newRootVC {
  [UIView transitionWithView:self.window duration:0.28 options:UIViewAnimationOptionTransitionCrossDissolve animations:^{
    [UIView setAnimationsEnabled:YES];
    if (self.window.rootViewController!=newRootVC) {
      self.window.rootViewController = newRootVC;
      [self.window makeKeyAndVisible];
    }
    [UIView setAnimationsEnabled:[UIView areAnimationsEnabled]];
  } completion:nil];
}

- (void)loadRootController{
  [WTSafeGuard startSafeGuardWithType:WTSafeGuardType_NilTarget| WTSafeGuardType_Foundation|WTSafeGuardType_KVO|WTSafeGuardType_Timer|WTSafeGuardType_MainThreadUI];
    self.isLoadForJS = YES;
   // [self rquestHttpData];
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    [self loadReactNativeController];
    rootViewController.view = self.rootView;
    rootViewController.view.backgroundColor = [UIColor whiteColor];
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
    [self JD_OtherSDKInit];
  [self registAppPush];
}

- (void)loadReactNativeController{
  NSURL *jsCodeLocation;
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation moduleName:@"BBL" initialProperties:nil launchOptions:self.launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.rootView  = rootView;
}

- (void)reloadForJSRN{
  if (self.isLoadForJS) {
    return;
  }
  self.isLoadForJS = YES;
  dispatch_async(dispatch_get_main_queue(), ^{
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = self.rootView;
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
  });
}

- (void)setLoadFromR1N1Model:(BOOL)loadFromR1N1
{
  NSUserDefaults *defaults =[NSUserDefaults standardUserDefaults];
  if (loadFromR1N1) {
    [defaults setObject:@"1" forKey:@"JD_AppFromR1N1"];
  }else {
    [defaults setObject:@"0" forKey:@"JD_AppFromR1N1"];
  }
  [defaults synchronize];
}


-(bool)isNotExist:(NSString*)data{
  return data == nil || [data isEqualToString:@""]||[data isEqual:[NSNull null]];
}

- (void)JD_OtherSDKInit{
  NSDictionary *tempInfoDict = [[NSBundle mainBundle] infoDictionary];
  NSString *ukey = [tempInfoDict objectForKey:@"UmengKey"];
  NSString *jkey  = [tempInfoDict objectForKey:@"JPushKey"];
  NSString *channel = [tempInfoDict objectForKey:@"Channel"];
  NSString *tkey = [tempInfoDict objectForKey:@"tkey"];
  NSString *bkey = [tempInfoDict objectForKey:@"bkey"];
  // 极光推送
  if(![self isNotExist:jkey]){
    NSLog(@"JD_OtherSDKInit---value %d",![self isNotExist:jkey]);
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    [JPUSHService setupWithOption:self.launchOptions appKey:jkey
                          channel:nil apsForProduction:true];
  }
  // 友盟统计
  NSLog(@"JD_OtherSDKInit--ukey-%d",![self isNotExist:ukey]);
  if(![self isNotExist:ukey]){
    [UMConfigure setLogEnabled:YES];
    [RNUMConfigure initWithAppkey:ukey channel:channel];
  }
  //talkingData
    if(![self isNotExist:tkey]){
        [TalkingData sessionStarted:tkey withChannelId:@"AppStore"];
    }
  //腾讯bugly
    if(![self isNotExist:bkey]){
      BuglyConfig * config = [[BuglyConfig alloc] init];
      config.reportLogLevel = BuglyLogLevelWarn;
      config.blockMonitorEnable = YES;
      config.blockMonitorTimeout = 1.5;
      [Bugly startWithAppId:bkey config:config];
    }
}

- (void)resetAppKeyWithDictionary:(NSDictionary *)dic{
  if (dic && [dic isKindOfClass:[NSDictionary class]]) {
    [self setObject:dic[@"ukey"] forKey:@"JD_ukey"];
    [self setObject:dic[@"tkey"] forKey:@"JD_tkey"];
    [self setObject:dic[@"jkey"] forKey:@"JD_jkey"];
    [self setObject:dic[@"bkey"] forKey:@"JD_bkey"];
    [self setObject:dic[@"eva"] forKey:@"JD_eva"];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults synchronize];
  }
}

- (void)setObject:(id)data forKey:(NSString *)key {
  if (key == nil || [key isEqualToString:@""]||[data isEqual:[NSNull null]] || [data isEqualToString:@""]) {
    return;
  }
  //NSLog(@"NSLog--object==2222==%d",[data isEqual:[NSNull null]]);
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:data forKey:key];
  [defaults synchronize];
}

- (void)registAppPush{
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
    JPUSHRegisterEntity *entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = UNAuthorizationOptionAlert | UNAuthorizationOptionBadge |
    UNAuthorizationOptionSound;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
  } else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    //可以添加自定义categories
    [JPUSHService
     registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                         UIUserNotificationTypeSound |
                                         UIUserNotificationTypeAlert)
     categories:nil];
  } else {
    // iOS 8以前 categories 必须为nil
    [JPUSHService
     registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                         UIRemoteNotificationTypeSound |
                                         UIRemoteNotificationTypeAlert)
     categories:nil];
  }
  [JPUSHService setupWithOption:self.launchOptions appKey:@"test"
                        channel:nil apsForProduction:true];
//  [JPUSHService setupWithOption:launchOptions
//                         appKey:appKey
//                        channel:channel
//               apsForProduction:isProduction];
}


#pragma mark 极光推送
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [JPUSHService registerDeviceToken:deviceToken];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  NSDictionary * userInfo = notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  
  completionHandler(UNNotificationPresentationOptionAlert);
}
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  [JPUSHService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  
  completionHandler();
}
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:notification.userInfo];
}

@end
