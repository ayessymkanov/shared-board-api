import { GraphQLResolveInfo } from 'graphql';
import { User as UserModel, Card as CardModel, Team as TeamModel } from '.prisma/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = undefined | T;
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

export type AddCardInput = {
  assigneeId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDateTime: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type AddTeamInput = {
  name: Scalars['String']['input'];
};

export type AddTeamMemberInput = {
  email: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type Card = {
  __typename?: 'Card';
  assignee: User;
  assigneeId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDateTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: Status;
  team: Team;
  teamId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CardsFilterInput = {
  endTimestamp?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCard: Scalars['String']['output'];
  addTeam: Team;
  addTeamMember: Scalars['String']['output'];
  updateCard: Scalars['String']['output'];
};


export type MutationAddCardArgs = {
  input: AddCardInput;
};


export type MutationAddTeamArgs = {
  input: AddTeamInput;
};


export type MutationAddTeamMemberArgs = {
  input: AddTeamMemberInput;
};


export type MutationUpdateCardArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<AddCardInput>;
};

export type Query = {
  __typename?: 'Query';
  card?: Maybe<Card>;
  cards: Array<Card>;
  me: User;
  team?: Maybe<Team>;
  teamMembers: Array<User>;
  teams: Array<Team>;
  today: Array<Maybe<Card>>;
  user?: Maybe<User>;
  userCards: Array<Card>;
  users: Array<User>;
};


export type QueryCardArgs = {
  id: Scalars['String']['input'];
};


export type QueryCardsArgs = {
  input?: InputMaybe<CardsFilterInput>;
};


export type QueryTeamArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeamMembersArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export enum Status {
  Done = 'Done',
  InProgress = 'In_progress',
  Open = 'Open'
}

export type Team = {
  __typename?: 'Team';
  adminId: Scalars['Int']['output'];
  cards: Array<Card>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  teamMembers: Array<User>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  personalBoardId?: Maybe<Scalars['Int']['output']>;
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



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddCardInput: AddCardInput;
  AddTeamInput: AddTeamInput;
  AddTeamMemberInput: AddTeamMemberInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Card: ResolverTypeWrapper<CardModel>;
  CardsFilterInput: CardsFilterInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Team: ResolverTypeWrapper<TeamModel>;
  User: ResolverTypeWrapper<UserModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddCardInput: AddCardInput;
  AddTeamInput: AddTeamInput;
  AddTeamMemberInput: AddTeamMemberInput;
  Boolean: Scalars['Boolean']['output'];
  Card: CardModel;
  CardsFilterInput: CardsFilterInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Team: TeamModel;
  User: UserModel;
};

export type CardResolvers<ContextType = any, ParentType = ResolversParentTypes['Card']> = {
  assignee?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  assigneeId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDateTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  team?: Resolver<ResolversTypes['Team'], ParentType, ContextType>;
  teamId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType = ResolversParentTypes['Mutation']> = {
  addCard?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddCardArgs, 'input'>>;
  addTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationAddTeamArgs, 'input'>>;
  addTeamMember?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAddTeamMemberArgs, 'input'>>;
  updateCard?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationUpdateCardArgs, 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType = ResolversParentTypes['Query']> = {
  card?: Resolver<Maybe<ResolversTypes['Card']>, ParentType, ContextType, RequireFields<QueryCardArgs, 'id'>>;
  cards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType, Partial<QueryCardsArgs>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'id'>>;
  teamMembers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryTeamMembersArgs, 'id'>>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  today?: Resolver<Array<Maybe<ResolversTypes['Card']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userCards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType = ResolversParentTypes['Team']> = {
  adminId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  cards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamMembers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  personalBoardId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Card?: CardResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

