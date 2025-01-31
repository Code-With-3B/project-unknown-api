/* eslint-disable */
// @ts-nocheck
// THIS FILE IS AUTOGENERATED DO NOT MODIFY BY HAND
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum MediaType {
  HighlightImage = 'HIGHLIGHT_IMAGE',
  HighlightVideo = 'HIGHLIGHT_VIDEO',
  ProfileBanner = 'PROFILE_BANNER',
  ProfilePicture = 'PROFILE_PICTURE'
}

export type Query = {
  __typename?: 'Query';
  requestUploadUrl: RequestUploadUrlResponse;
};


export type QueryRequestUploadUrlArgs = {
  input: RequestUploadUrlInput;
};

export type RequestUploadUrlFileDetailsInput = {
  fileName: Scalars['String']['input'];
  fileSize: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
};

export type RequestUploadUrlInput = {
  file: RequestUploadUrlFileDetailsInput;
  mediaType: MediaType;
  userId: Scalars['ID']['input'];
};

export type RequestUploadUrlResponse = ResponsePayload & {
  __typename?: 'RequestUploadUrlResponse';
  code?: Maybe<Array<Scalars['String']['output']>>;
  success: Scalars['Boolean']['output'];
  uploadUrl?: Maybe<Scalars['String']['output']>;
};

export type ResponsePayload = {
  code?: Maybe<Array<Scalars['String']['output']>>;
  success: Scalars['Boolean']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  ResponsePayload: ( RequestUploadUrlResponse );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  MediaType: MediaType;
  Query: ResolverTypeWrapper<{}>;
  RequestUploadUrlFileDetailsInput: RequestUploadUrlFileDetailsInput;
  RequestUploadUrlInput: RequestUploadUrlInput;
  RequestUploadUrlResponse: ResolverTypeWrapper<RequestUploadUrlResponse>;
  ResponsePayload: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ResponsePayload']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Query: {};
  RequestUploadUrlFileDetailsInput: RequestUploadUrlFileDetailsInput;
  RequestUploadUrlInput: RequestUploadUrlInput;
  RequestUploadUrlResponse: RequestUploadUrlResponse;
  ResponsePayload: ResolversInterfaceTypes<ResolversParentTypes>['ResponsePayload'];
  String: Scalars['String']['output'];
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  requestUploadUrl?: Resolver<ResolversTypes['RequestUploadUrlResponse'], ParentType, ContextType, RequireFields<QueryRequestUploadUrlArgs, 'input'>>;
};

export type RequestUploadUrlResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestUploadUrlResponse'] = ResolversParentTypes['RequestUploadUrlResponse']> = {
  code?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  uploadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponsePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponsePayload'] = ResolversParentTypes['ResponsePayload']> = {
  __resolveType: TypeResolveFn<'RequestUploadUrlResponse', ParentType, ContextType>;
  code?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  RequestUploadUrlResponse?: RequestUploadUrlResponseResolvers<ContextType>;
  ResponsePayload?: ResponsePayloadResolvers<ContextType>;
};

